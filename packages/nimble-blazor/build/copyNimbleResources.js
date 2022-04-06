const path = require('path');
const glob = require('glob');
const fs = require('fs');

const args = process.argv.slice(2);
const buildConfiguration = args[0]; // Debug or Release
const destinationDirectory = args[1]; // e.g. Path/To/Examples/NimbleBlazor.Demo.Server/wwwroot
if ((buildConfiguration !== 'Debug' && buildConfiguration !== 'Release') || typeof destinationDirectory !== 'string'
    || fs.existsSync(destinationDirectory) === false) {
    throw new Error('Expected Arguments: BuildConfiguration DestinationDirectory. '
        + 'BuildConfiguration: Debug or Release. DestinationDirectory: Typically the full path to a Blazor app wwwroot directory.');
}

const resolvePackagePath = packageName => path.dirname(require.resolve(`${packageName}/package.json`));
const nimbleComponentsPath = resolvePackagePath('@ni/nimble-components');
const nimbleTokensPath = resolvePackagePath('@ni/nimble-tokens');

const componentsSrcDebug = [
    { src: 'dist/all-components-bundle.js' },
    { src: 'dist/all-components-bundle.js.map' }
];
const componentsSrcRelease = [
    { src: 'dist/all-components-bundle.min.js', dest: 'all-components-bundle.js' },
    { src: 'dist/all-components-bundle.min.js.map', dest: 'all-components-bundle.js.map' }
];
const componentsSrc = buildConfiguration === 'Release' ? componentsSrcRelease : componentsSrcDebug;
const tokensSrc = [
    { src: 'source/fonts.css' },
    { src: 'assets-fonts/*' }
];

function copyFiles(srcPatterns, srcPath, destRelativeDirectory) {
    for (const pattern of srcPatterns) {
        for (const currentSrcPath of glob.sync(path.resolve(srcPath, pattern.src))) {
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

prepareDestinationDirectory('nimble-components');
copyFiles(componentsSrc, nimbleComponentsPath, 'nimble-components');
prepareDestinationDirectory('nimble-tokens');
copyFiles(tokensSrc, nimbleTokensPath, 'nimble-tokens');
