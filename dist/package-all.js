import fs from "node:fs";
import path from "node:path";
import { parseArguments } from "./release/arguments";
import { createReleasePaths } from "./release/paths";
import { ensureDirectory, readJson } from "./release/utils";
import { assertGitWorkingTreeClean, assertReleaseDoesNotExist, assertRemoteTagDoesNotExist, assertRepository, checkGitHubAuthentication, validateReleaseInput, } from "./release/preflight";
import { hashFile, hashFiles } from "./release/hash";
import { generateSbom } from "./release/sbom";
import { createReleaseManifest, writeReleaseManifest, } from "./release/release-manifest";
import { createSha256SumsFile } from "./release/shasums";
import { resolveReleaseSigningKey } from "./release/majik-key-resolver";
import { createMajikReleaseSignature } from "./release/majik-signer";
import { createReleaseRecord, writeReleaseRecord, } from "./release/release-record";
import { commitReleaseRecord, createAndPushAnnotatedTag, getCurrentCommit, pushCurrentBranch, } from "./release/git";
import { createDraftGitHubRelease, getGitHubReleaseUrl, publishGitHubRelease, } from "./release/github-release";
const ROOT = process.cwd();
const { version, dryRun } = parseArguments();
const config = readJson(path.join(ROOT, "release.config.json"));
const paths = createReleasePaths(ROOT, version, config.signing);
console.log("");
console.log("Majik Signature Release Publisher");
console.log("──────────────────────────────────");
console.log(`Version: ${version}`);
console.log(`Tag: ${paths.tag}`);
console.log("");
// Phase 1 — Preconditions
checkGitHubAuthentication();
assertRepository(config.repository);
assertReleaseDoesNotExist(config.repository, paths.tag);
assertRemoteTagDoesNotExist(paths.tag);
assertGitWorkingTreeClean();
// Record the clean automation baseline that generated this release metadata.
process.env.MAJIK_RELEASE_AUTOMATION_COMMIT = getCurrentCommit();
// Phase 2 — Validate release input
const input = validateReleaseInput(paths, config);
// Phase 3 — Prepare staging directory
fs.rmSync(paths.releaseOutputDir, {
    recursive: true,
    force: true,
});
ensureDirectory(paths.releaseOutputDir);
// Phase 4 — Hash release installers
console.log("\nHashing release assets...");
const installerAssets = await hashFiles(input.installerFiles);
for (const asset of installerAssets) {
    console.log(`✓ ${asset.filename}`);
}
const changelogAsset = await hashFile(input.changelogFile);
console.log("✓ CHANGELOG.md");
// Phase 5 — Generate SBOM
const generatedSbom = await generateSbom(ROOT, paths.releaseOutputDir, config.sbom);
const sbomAsset = generatedSbom
    ? await hashFile(generatedSbom.filePath)
    : undefined;
// Phase 6 — Generate release manifest
console.log("\nGenerating release manifest...");
const manifest = createReleaseManifest(paths, config, installerAssets.map(({ absolutePath, ...asset }) => asset), {
    filename: changelogAsset.filename,
    size: changelogAsset.size,
    sha256: changelogAsset.sha256,
}, sbomAsset
    ? {
        filename: sbomAsset.filename,
        size: sbomAsset.size,
        sha256: sbomAsset.sha256,
    }
    : undefined);
writeReleaseManifest(paths.manifestFile, manifest);
const manifestAsset = await hashFile(paths.manifestFile);
// Phase 7 — Generate SHA256SUMS.txt
// This intentionally excludes itself. The release manifest does not reference
// SHA256SUMS.txt, so there is no circular hash dependency.
console.log("\nGenerating SHA256SUMS.txt...");
const checksumInputs = [
    ...installerAssets,
    changelogAsset,
    ...(sbomAsset ? [sbomAsset] : []),
    manifestAsset,
];
createSha256SumsFile(paths.checksumFile, checksumInputs);
console.log("✓ SHA256SUMS.txt");
const checksumAsset = await hashFile(paths.checksumFile);
// Phase 8 — Sign the complete release package with Majik Signature.
// The .mjksmap is the terminal artifact: it signs everything else, but not itself.
const filesToSign = [
    ...installerAssets.map((asset) => ({
        absolutePath: asset.absolutePath,
        path: asset.filename,
    })),
    {
        absolutePath: input.changelogFile,
        path: changelogAsset.filename,
    },
    ...(generatedSbom && sbomAsset
        ? [
            {
                absolutePath: generatedSbom.filePath,
                path: sbomAsset.filename,
            },
        ]
        : []),
    {
        absolutePath: paths.manifestFile,
        path: manifestAsset.filename,
    },
    {
        absolutePath: paths.checksumFile,
        path: checksumAsset.filename,
    },
];
let majikSignatureAsset;
if (config.signing?.enabled !== false) {
    const releaseKey = await resolveReleaseSigningKey({
        keyPathEnv: config.signing?.keyPathEnv ?? "MAJIK_RELEASE_KEY_PATH",
        passphraseEnv: config.signing?.passphraseEnv ?? "MAJIK_RELEASE_KEY_PASSPHRASE",
    });
    try {
        const result = await createMajikReleaseSignature(filesToSign, releaseKey, paths.majikSignatureMapFile);
        majikSignatureAsset = await hashFile(result.outputPath);
    }
    finally {
        releaseKey.lock();
    }
}
else {
    console.log("\nMajik Signature release signing disabled.");
}
// Phase 9 — Dry run gate
if (dryRun) {
    console.log("\nDRY RUN");
    console.log("───────");
    console.log(`Version: ${version}`);
    console.log(`Tag: ${paths.tag}`);
    console.log(`Installers: ${installerAssets.length}`);
    console.log(`SHA256SUMS: ${paths.checksumFile}`);
    console.log(`Manifest: ${paths.manifestFile}`);
    console.log(`SBOM: ${sbomAsset?.absolutePath ?? "disabled"}`);
    console.log(`Majik Signature: ${majikSignatureAsset?.absolutePath ?? "disabled"}`);
    console.log("");
    console.log("No commit, tag, push, or GitHub release was created.");
    process.exit(0);
}
// Phase 10 — Release record
console.log("\nGenerating release record...");
const releaseMetadata = [
    manifestAsset,
    checksumAsset,
    ...(sbomAsset ? [sbomAsset] : []),
    ...(majikSignatureAsset ? [majikSignatureAsset] : []),
];
const releaseRecord = createReleaseRecord(paths, config, installerAssets, releaseMetadata);
const releaseRecordPath = writeReleaseRecord(paths, releaseRecord);
// Phase 11 — Commit + tag
commitReleaseRecord(releaseRecordPath, paths.tag);
pushCurrentBranch();
createAndPushAnnotatedTag(paths.tag);
// Phase 12 — GitHub release
const releaseAssets = [
    ...installerAssets.map((asset) => asset.absolutePath),
    paths.changelogFile,
    paths.checksumFile,
    paths.manifestFile,
    ...(sbomAsset ? [sbomAsset.absolutePath] : []),
    ...(majikSignatureAsset ? [majikSignatureAsset.absolutePath] : []),
];
createDraftGitHubRelease(config.repository, config.productName, paths, releaseAssets);
publishGitHubRelease(config.repository, paths.tag);
const releaseUrl = getGitHubReleaseUrl(config.repository, paths.tag);
console.log("\n──────────────────────────────────");
console.log(`✓ ${config.productName} ${paths.tag} published`);
console.log(`✓ Release: ${releaseUrl}`);
console.log("──────────────────────────────────");
console.log("");
