/* eslint-env node */
const { readFileSync } = require('node:fs');
const path = require('node:path');

/** @typedef {import('lage').ConfigOptions} LageConfig */

const projectRoot = __dirname;
const workspaceManifestPath = path.join(projectRoot, 'scripts/lint/workspaces.json');

const workspaceManifest = JSON.parse(readFileSync(workspaceManifestPath, 'utf8'));
if (!Array.isArray(workspaceManifest.workspaces) || workspaceManifest.workspaces.length === 0) {
    console.error(`ERROR: No workspaces found in ${workspaceManifestPath}`);
    console.error('Remediation: Verify workspaces.json contains a "workspaces" array with at least one entry');
    process.exit(1);
}
const workspaces = workspaceManifest.workspaces;

const workspaceMap = new Map(workspaces.map((workspace) => [workspace.name, workspace]));

const weightLookup = new Map([
    ['light', 1],
    ['standard', 2],
    ['heavy', 4]
]);

const resolveWeight = (packageName) => {
    const workspace = workspaceMap.get(packageName ?? '');
    if (!workspace) {
        return weightLookup.get('standard');
    }

    return weightLookup.get(workspace.weight) ?? weightLookup.get('standard');
};

/** @type {LageConfig} */
const config = {
    npmClient: 'npm',
    concurrency: Number(process.env.LAGE_CONCURRENCY ?? 4),
    allowNoTargetRuns: true,
    pipeline: {
        lint: {
            dependsOn: ['^lint'],
            cache: true,
            inputs: [
                'package-lock.json',
                'lage.config.js',
                'scripts/lint/workspaces.json'
            ],
            outputs: ['.eslintcache'],
            weight: (target, maxWorkers = 4) => {
                const resolvedWeight = resolveWeight(target.packageName);
                return Math.min(resolvedWeight ?? 2, maxWorkers);
            }
        }
    },
    cacheOptions: {
        cacheStorageConfig: {
            provider: 'local'
        },
        outputGlob: ['.eslintcache'],
        internalCacheFolder: path.join(projectRoot, '.lage/cache'),
        logFolder: path.join(projectRoot, '.lage/logs'),
        environmentGlob: [
            'package-lock.json',
            'lage.config.js',
            'scripts/lint/workspaces.json'
        ]
    },
    ignore: ['**/dist/**', '**/build/**', 'docs/**'],
    repoWideChanges: [
        'package-lock.json',
        'lage.config.js',
        'scripts/lint/workspaces.json',
        'scripts/lint/types.ts'
    ],
    priorities: workspaces
        .filter((workspace) => workspace.weight === 'heavy')
        .map((workspace) => ({
            package: workspace.name,
            task: 'lint',
            priority: 10
        }))
};

module.exports = config;
