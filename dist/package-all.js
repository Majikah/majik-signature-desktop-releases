import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { execFileSync } from "node:child_process";
const ROOT = process.cwd();
function fail(message) {
    console.error(`\n✗ ${message}\n`);
    process.exit(1);
}
function run(command, args, options = {}) {
    try {
        return execFileSync(command, args, {
            cwd: ROOT,
            encoding: "utf8",
            stdio: options.stdio ?? "pipe",
        }).trim();
    }
    catch (error) {
        if (error && typeof error === "object") {
            const output = error;
            if (output.stdout) {
                console.error(String(output.stdout));
            }
            if (output.stderr) {
                console.error(String(output.stderr));
            }
        }
        fail(`Command failed: ${command} ${args.join(" ")}`);
    }
}
function tryRun(command, args) {
    try {
        const stdout = execFileSync(command, args, {
            cwd: ROOT,
            encoding: "utf8",
            stdio: "pipe",
        });
        return {
            status: 0,
            stdout: stdout.trim(),
            stderr: "",
        };
    }
    catch (error) {
        if (!error || typeof error !== "object") {
            return {
                status: 1,
                stdout: "",
                stderr: String(error),
            };
        }
        const output = error;
        return {
            status: typeof output.status === "number"
                ? output.status
                : 1,
            stdout: output.stdout
                ? String(output.stdout).trim()
                : "",
            stderr: output.stderr
                ? String(output.stderr).trim()
                : "",
        };
    }
}
function normalizeVersion(input) {
    const value = String(input ?? "")
        .trim()
        .replace(/^v/i, "");
    const match = value.match(/^(\d+)\.(\d+)(?:\.(\d+))?$/);
    if (!match) {
        fail(`Invalid version "${input}". Use formats such as 0.17 or 0.17.0.`);
    }
    return `${match[1]}.${match[2]}.${match[3] ?? "0"}`;
}
function readJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, "utf8"));
    }
    catch (error) {
        const message = error instanceof Error
            ? error.message
            : String(error);
        fail(`Unable to read JSON file: ${file}\n${message}`);
    }
}
function sha256(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash("sha256");
        const stream = fs.createReadStream(filePath);
        stream.on("error", reject);
        stream.on("data", (chunk) => {
            hash.update(chunk);
        });
        stream.on("end", () => {
            resolve(hash.digest("hex"));
        });
    });
}
function getFiles(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }
    return fs
        .readdirSync(dir, {
        withFileTypes: true,
    })
        .filter((entry) => entry.isFile())
        .map((entry) => path.join(dir, entry.name))
        .sort((a, b) => path.basename(a).localeCompare(path.basename(b)));
}
function isChangelog(file) {
    return (path
        .basename(file)
        .toLowerCase() === "changelog.md");
}
function parseArguments() {
    const args = process.argv.slice(2);
    const dryRun = args.includes("--dry-run");
    const versionArgument = args.find((arg) => !arg.startsWith("--"));
    if (!versionArgument) {
        fail("Usage: npm run package:all -- 0.17.0 [--dry-run]");
    }
    return {
        version: normalizeVersion(versionArgument),
        dryRun,
    };
}
//
// Arguments
//
const { version, dryRun } = parseArguments();
const tag = `v${version}`;
//
// Configuration
//
const config = readJson(path.join(ROOT, "release.config.json"));
//
// Header
//
console.log("");
console.log("Majik Signature Release Publisher");
console.log("──────────────────────────────────");
console.log(`Version: ${version}`);
console.log(`Tag: ${tag}`);
console.log("");
//
// GitHub authentication
//
console.log("Checking GitHub authentication...");
const githubUser = run("gh", [
    "api",
    "user",
    "--jq",
    ".login",
]);
if (!githubUser) {
    fail("GitHub authentication check failed. Run `gh auth login` and try again.");
}
console.log(`✓ Authenticated as ${githubUser}`);
//
// Repository
//
console.log("\nChecking repository...");
const currentRepo = run("gh", [
    "repo",
    "view",
    "--json",
    "nameWithOwner",
    "--jq",
    ".nameWithOwner",
]);
if (currentRepo !== config.repository) {
    fail([
        "Wrong repository.",
        `Expected: ${config.repository}`,
        `Found: ${currentRepo}`,
    ].join("\n"));
}
console.log(`✓ ${currentRepo}`);
//
// Paths
//
const inputDir = path.join(ROOT, "release-input", version);
const releaseOutputDir = path.join(ROOT, ".release", version);
const releaseRecordDir = path.join(ROOT, "release-records");
const changelogFile = path.join(inputDir, "CHANGELOG.md");
//
// Validate input directory
//
if (!fs.existsSync(inputDir) ||
    !fs.statSync(inputDir).isDirectory()) {
    fail(`Missing release input directory:\n${inputDir}`);
}
if (!fs.existsSync(changelogFile) ||
    !fs.statSync(changelogFile).isFile()) {
    fail(`Missing CHANGELOG.md:\n${changelogFile}`);
}
console.log(`\nChecking release-input/${version}/...`);
const allFiles = getFiles(inputDir);
if (allFiles.length === 0) {
    fail("No release files found.");
}
//
// Separate CHANGELOG.md from installer assets
//
const installerFiles = allFiles.filter((file) => !isChangelog(file));
if (installerFiles.length === 0) {
    fail("No installer files found. CHANGELOG.md cannot be the only release file.");
}
//
// Validate configured platforms
//
const enabledPlatforms = Object.entries(config.platforms).filter(([, platform]) => platform.enabled);
if (enabledPlatforms.length === 0) {
    fail("No enabled platforms are configured in release.config.json.");
}
const missing = [];
for (const [platformName, platform,] of enabledPlatforms) {
    console.log(`\n${platformName}:`);
    for (const extension of platform.requiredExtensions) {
        const matches = installerFiles.filter((file) => file
            .toLowerCase()
            .endsWith(extension.toLowerCase()));
        if (matches.length === 0) {
            missing.push(`${platformName}: ${extension}`);
            console.log(`  ✗ ${extension}`);
        }
        else {
            console.log(`  ✓ ${extension} (${matches
                .map((file) => path.basename(file))
                .join(", ")})`);
        }
    }
}
if (missing.length > 0) {
    fail([
        `Release ${version} is incomplete.`,
        "",
        "Missing:",
        ...missing.map((item) => `  ✗ ${item}`),
    ].join("\n"));
}
console.log("\n✓ All required platform assets found");
console.log("✓ CHANGELOG.md found");
//
// Check existing GitHub release
//
console.log("\nChecking existing GitHub release...");
const releaseCheck = tryRun("gh", [
    "api",
    `repos/${config.repository}/releases/tags/${tag}`,
]);
if (releaseCheck.status === 0) {
    fail(`GitHub release ${tag} already exists.`);
}
// A 404 is expected when the release does not exist.
// Any other failure should be treated as an actual error.
if (releaseCheck.status !== 0 &&
    !/404|not found/i.test(releaseCheck.stderr)) {
    console.error(releaseCheck.stderr ||
        releaseCheck.stdout);
    fail(`Unable to check whether GitHub release ${tag} exists.`);
}
console.log("✓ No existing release");
//
// Check existing remote tag
//
console.log("\nChecking existing remote tag...");
const existingTag = run("git", [
    "ls-remote",
    "--tags",
    "origin",
    `refs/tags/${tag}`,
]);
if (existingTag) {
    fail(`Remote tag ${tag} already exists.`);
}
console.log("✓ No existing tag");
//
// Git working tree
//
console.log("\nChecking Git working tree...");
const gitStatus = run("git", [
    "status",
    "--porcelain",
]);
if (gitStatus) {
    console.log("\nGit working tree:");
    console.log(gitStatus);
    fail("Git working tree is not clean. Commit or stash unrelated changes before publishing.");
}
console.log("✓ Git working tree is clean");
//
// Generate SHA-256 checksums
//
console.log("\nGenerating SHA-256 checksums...");
fs.rmSync(releaseOutputDir, {
    recursive: true,
    force: true,
});
fs.mkdirSync(releaseOutputDir, {
    recursive: true,
});
const checksums = [];
const assets = [];
for (const file of installerFiles) {
    const filename = path.basename(file);
    const size = fs.statSync(file).size;
    const hash = await sha256(file);
    checksums.push(`${hash}  ${filename}`);
    assets.push({
        filename,
        size,
        sha256: hash,
    });
    console.log(`✓ ${filename}`);
}
//
// Hash CHANGELOG.md
//
const changelogHash = await sha256(changelogFile);
const changelogSize = fs.statSync(changelogFile).size;
checksums.push(`${changelogHash}  CHANGELOG.md`);
assets.push({
    filename: "CHANGELOG.md",
    size: changelogSize,
    sha256: changelogHash,
});
console.log("✓ CHANGELOG.md");
//
// Write SHA256SUMS.txt
//
const checksumFile = path.join(releaseOutputDir, "SHA256SUMS.txt");
fs.writeFileSync(checksumFile, `${checksums.join("\n")}\n`, "utf8");
console.log("✓ SHA256SUMS.txt");
//
// Dry run
//
if (dryRun) {
    console.log("\nDRY RUN");
    console.log("───────");
    console.log(`Version: ${version}`);
    console.log(`Tag: ${tag}`);
    console.log(`Assets: ${assets.length}`);
    console.log(`Checksum: ${checksumFile}`);
    console.log(`Changelog: ${changelogFile}`);
    console.log("");
    console.log("No commit, tag, push, or release was created.");
    process.exit(0);
}
//
// Generate release record
//
const releaseRecord = {
    version,
    tag,
    product: config.productName,
    repository: config.repository,
    generatedAt: new Date().toISOString(),
    changelog: "CHANGELOG.md",
    assets,
};
const releaseRecordPath = path.join(releaseRecordDir, `${version}.json`);
fs.mkdirSync(releaseRecordDir, {
    recursive: true,
});
fs.writeFileSync(releaseRecordPath, `${JSON.stringify(releaseRecord, null, 2)}\n`, "utf8");
console.log("\n✓ Release metadata generated");
//
// Commit release metadata
//
console.log("\nCommitting release metadata...");
run("git", [
    "add",
    releaseRecordPath,
], {
    stdio: "inherit",
});
run("git", [
    "commit",
    "-m",
    `release: ${tag}`,
], {
    stdio: "inherit",
});
//
// Push release metadata
//
console.log("\nPushing release metadata...");
const branch = run("git", [
    "branch",
    "--show-current",
]);
if (!branch) {
    fail("Unable to determine current Git branch.");
}
run("git", [
    "push",
    "origin",
    branch,
], {
    stdio: "inherit",
});
//
// Create annotated tag
//
console.log(`\nCreating tag ${tag}...`);
run("git", [
    "tag",
    "-a",
    tag,
    "-m",
    `Majik Signature ${tag}`,
], {
    stdio: "inherit",
});
run("git", [
    "push",
    "origin",
    tag,
], {
    stdio: "inherit",
});
//
// Create draft GitHub release
//
console.log("\nCreating GitHub draft release...");
const assetPaths = [
    ...installerFiles,
    changelogFile,
    checksumFile,
];
run("gh", [
    "release",
    "create",
    tag,
    ...assetPaths,
    "--draft",
    "--verify-tag",
    "--title",
    `${config.productName} ${tag}`,
    "--notes-file",
    changelogFile,
], {
    stdio: "inherit",
});
//
// Publish GitHub release
//
console.log("\nPublishing GitHub release...");
run("gh", [
    "release",
    "edit",
    tag,
    "--draft=false",
], {
    stdio: "inherit",
});
//
// Get final release URL
//
const releaseUrl = run("gh", [
    "release",
    "view",
    tag,
    "--json",
    "url",
    "--jq",
    ".url",
]);
//
// Complete
//
console.log("\n──────────────────────────────────");
console.log(`✓ ${config.productName} ${tag} published`);
console.log(`✓ Release: ${releaseUrl}`);
console.log("──────────────────────────────────");
console.log("");
