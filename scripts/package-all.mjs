import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { execFileSync } from 'node:child_process';

const ROOT = process.cwd();

function fail(message) {
    console.error(`\n✗ ${message}\n`);
    process.exit(1);
}

function run(command, args, options = {}) {
    try {
        return execFileSync(command, args, {
            cwd: ROOT,
            encoding: 'utf8',
            stdio: options.stdio ?? 'pipe'
        }).trim();
    } catch (error) {
        if (options.allowFailure) {
            return null;
        }

        console.error(error.stdout ?? '');
        console.error(error.stderr ?? '');
        fail(`Command failed: ${command} ${args.join(' ')}`);
    }
}

function normalizeVersion(input) {
    const value = String(input ?? '').trim().replace(/^v/i, '');

    const match = value.match(
        /^(\d+)\.(\d+)(?:\.(\d+))?$/
    );

    if (!match) {
        fail(
            `Invalid version "${input}". Use formats such as 0.17 or 0.17.0.`
        );
    }

    return `${match[1]}.${match[2]}.${match[3] ?? '0'}`;
}

function readJson(file) {
    try {
        return JSON.parse(fs.readFileSync(file, 'utf8'));
    } catch (error) {
        fail(`Unable to read JSON file: ${file}\n${error.message}`);
    }
}

function sha256(filePath) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('sha256');
        const stream = fs.createReadStream(filePath);

        stream.on('error', reject);
        stream.on('data', chunk => hash.update(chunk));
        stream.on('end', () => resolve(hash.digest('hex')));
    });
}

function getFiles(dir) {
    if (!fs.existsSync(dir)) {
        return [];
    }

    return fs
        .readdirSync(dir, { withFileTypes: true })
        .filter(entry => entry.isFile())
        .map(entry => path.join(dir, entry.name));
}

const version = normalizeVersion(process.argv[2]);

if (!version) {
    fail('Usage: npm run package:all -- 0.17.0');
}

const tag = `v${version}`;
const config = readJson(path.join(ROOT, 'release.config.json'));

console.log('');
console.log('Majik Signature Release Publisher');
console.log('──────────────────────────────────');
console.log(`Version: ${version}`);
console.log('');

console.log('Checking GitHub authentication...');
run('gh', ['auth', 'status'], { stdio: 'inherit' });

console.log('\nChecking repository...');

const currentRepo = run('gh', [
    'repo',
    'view',
    '--json',
    'nameWithOwner',
    '--jq',
    '.nameWithOwner'
]);

if (currentRepo !== config.repository) {
    fail(
        `Wrong repository.\nExpected: ${config.repository}\nFound: ${currentRepo}`
    );
}

const inputDir = path.join(ROOT, 'release-input', version);
const releaseOutputDir = path.join(ROOT, '.release', version);
const releaseRecordDir = path.join(ROOT, 'release-records');
const notesDir = path.join(ROOT, 'release-notes');

if (!fs.existsSync(inputDir)) {
    fail(`Missing release input directory:\n${inputDir}`);
}

console.log(`\nChecking installers in release-input/${version}/...`);

const files = getFiles(inputDir);

if (files.length === 0) {
    fail('No installer files found.');
}

const enabledPlatforms = Object.entries(config.platforms)
    .filter(([, platform]) => platform.enabled);

const missing = [];

for (const [platformName, platform] of enabledPlatforms) {
    console.log(`\n${platformName}:`);

    for (const extension of platform.requiredExtensions) {
        const matches = files.filter(file =>
            file.toLowerCase().endsWith(extension.toLowerCase())
        );

        if (matches.length === 0) {
            missing.push(`${platformName}: ${extension}`);
            console.log(`  ✗ ${extension}`);
        } else {
            console.log(
                `  ✓ ${extension} (${matches.map(file => path.basename(file)).join(', ')})`
            );
        }
    }
}

if (missing.length > 0) {
    fail(
        `Release ${version} is incomplete.\n\nMissing:\n${missing
            .map(item => `  ✗ ${item}`)
            .join('\n')}`
    );
}

console.log('\nChecking existing GitHub release...');

const existingRelease = run(
    'gh',
    ['release', 'view', tag],
    { allowFailure: true }
);

if (existingRelease) {
    fail(`GitHub release ${tag} already exists.`);
}

console.log('✓ No existing release');

console.log('\nChecking existing remote tag...');

const existingTag = run(
    'git',
    ['ls-remote', '--tags', 'origin', `refs/tags/${tag}`],
    { allowFailure: true }
);

if (existingTag) {
    fail(`Remote tag ${tag} already exists.`);
}

console.log('✓ No existing tag');

const gitStatus = run('git', ['status', '--porcelain']);

if (gitStatus) {
    console.log('\nGit working tree:');
    console.log(gitStatus);
    fail(
        'Git working tree is not clean. Commit or stash unrelated changes before publishing.'
    );
}

console.log('\nGenerating SHA-256 checksums...');

fs.rmSync(releaseOutputDir, {
    recursive: true,
    force: true
});

fs.mkdirSync(releaseOutputDir, {
    recursive: true
});

const checksums = [];

for (const file of files) {
    const hash = await sha256(file);
    const filename = path.basename(file);

    checksums.push(`${hash}  ${filename}`);

    console.log(`✓ ${filename}`);
}

const checksumFile = path.join(
    releaseOutputDir,
    'SHA256SUMS.txt'
);

fs.writeFileSync(
    checksumFile,
    `${checksums.join('\n')}\n`,
    'utf8'
);

const notesFile = path.join(
    notesDir,
    `${version}.md`
);

if (!fs.existsSync(notesFile)) {
    fs.mkdirSync(notesDir, { recursive: true });

    fs.writeFileSync(
        notesFile,
        `# Majik Signature v${version}\n\nRelease notes for Majik Signature v${version}.\n`,
        'utf8'
    );
}

const releaseRecord = {
    version,
    tag,
    product: config.productName,
    repository: config.repository,
    generatedAt: new Date().toISOString(),
    assets: files.map(file => ({
        filename: path.basename(file),
        size: fs.statSync(file).size,
        sha256: checksums.find(line =>
            line.endsWith(`  ${path.basename(file)}`)
        )?.split('  ')[0]
    }))
};

const releaseRecordPath = path.join(
    releaseRecordDir,
    `${version}.json`
);

fs.mkdirSync(releaseRecordDir, {
    recursive: true
});

fs.writeFileSync(
    releaseRecordPath,
    `${JSON.stringify(releaseRecord, null, 2)}\n`,
    'utf8'
);

console.log('\n✓ Release metadata generated');

const dryRun = process.argv.includes('--dry-run');

if (dryRun) {
    console.log('\nDRY RUN');
    console.log('───────');
    console.log(`Version: ${version}`);
    console.log(`Tag: ${tag}`);
    console.log(`Assets: ${files.length}`);
    console.log(`Checksum: ${checksumFile}`);
    console.log('');
    console.log('No commit, tag, push, or release was created.');
    process.exit(0);
}

console.log('\nCommitting release metadata...');

run('git', [
    'add',
    releaseRecordPath,
    notesFile
], { stdio: 'inherit' });

run('git', [
    'commit',
    '-m',
    `release: ${tag}`
], { stdio: 'inherit' });

console.log('\nPushing release metadata...');

const branch = run('git', [
    'branch',
    '--show-current'
]);

run('git', [
    'push',
    'origin',
    branch
], { stdio: 'inherit' });

console.log(`\nCreating tag ${tag}...`);

run('git', [
    'tag',
    '-a',
    tag,
    '-m',
    `Majik Signature ${tag}`
], { stdio: 'inherit' });

run('git', [
    'push',
    'origin',
    tag
], { stdio: 'inherit' });

console.log('\nCreating GitHub draft release...');

const assetPaths = [
    ...files,
    checksumFile
];

run('gh', [
    'release',
    'create',
    tag,
    ...assetPaths,
    '--draft',
    '--verify-tag',
    '--title',
    `${config.productName} ${tag}`,
    '--notes-file',
    notesFile
], { stdio: 'inherit' });

console.log('\nPublishing GitHub release...');

run('gh', [
    'release',
    'edit',
    tag,
    '--draft=false'
], { stdio: 'inherit' });

const releaseUrl = run('gh', [
    'release',
    'view',
    tag,
    '--json',
    'url',
    '--jq',
    '.url'
]);

console.log('\n──────────────────────────────────');
console.log(`✓ ${config.productName} ${tag} published`);
console.log(`✓ Release: ${releaseUrl}`);
console.log('──────────────────────────────────');
console.log('');