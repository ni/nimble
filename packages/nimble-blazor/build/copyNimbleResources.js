const path = require('path');
const glob = require('glob');
const fs = require('fs');

const destinationDirectory = path.resolve(__dirname, '../NimbleBlazor/wwwroot');
console.log(`Destination directory for blazor assets: "${destinationDirectory}"`);

const nimbleComponentsPath = resolvePackagePath('@ni/nimble-bundle');
const nimbleTokensPath = resolvePackagePath('@ni/nimble-tokens');

const componentsBasePath = path.resolve(nimbleComponentsPath, 'dist');
const componentsSrc = [
    { src: 'all-components-bundle.min.*' }
];

const tokensBasePath = path.resolve(nimbleTokensPath, 'dist/fonts');
const tokensSrc = [
    { src: '**' }
];

prepareDestinationDirectory('nimble-components');
copyFiles(componentsSrc, componentsBasePath, 'nimble-components');
prepareDestinationDirectory('nimble-tokens');
copyFiles(tokensSrc, tokensBasePath, 'nimble-tokens');

function resolvePackagePath(packageName) {
    return path.dirname(require.resolve(`${packageName}/package.json`));
}

function copyFiles(srcPatterns, srcPath, destRelativeDirectory) {
    for (const pattern of srcPatterns) {
        const sourcePaths = glob.sync(pattern.src, {
            // glob paths should only have forward slashes
            // so run glob in resolved path (which has backslashes on windows)
            cwd: srcPath,
            absolute: true,
            nodir: true
        });
        if (sourcePaths.length <= 0) {
            throw new Error(`No files found at path ${pattern.src}`);
        }
        for (const currentSrcPath of sourcePaths) {
            const destRelativePath = pattern.dest ? pattern.dest : path.relative(srcPath, currentSrcPath);
            const destAbsolutePath = path.resolve(destinationDirectory, destRelativeDirectory, destRelativePath);
            const destAbsoluteDir = path.dirname(destAbsolutePath);
            if (!fs.existsSync(destAbsoluteDir)) {
                fs.mkdirSync(destAbsoluteDir, { recursive: true });
            }
            fs.copyFileSync(currentSrcPath, destAbsolutePath);
        }
    }
}

function prepareDestinationDirectory(destRelativeDirectory) {
    const destDirectory = path.resolve(destinationDirectory, destRelativeDirectory);
    if (fs.existsSync(destDirectory)) {
        fs.rmSync(destDirectory, { recursive: true });
    }
    fs.mkdirSync(destDirectory, { recursive: true });
}
