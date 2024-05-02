const path = require('path');
const glob = require('glob');
const fs = require('fs');

const target = process.argv[2];

let componentPackageName;
let destinationDirectory;
if (target === 'nimble') {
    componentPackageName = 'nimble-components';
    destinationDirectory = path.resolve(__dirname, '../NimbleBlazor/wwwroot');
} else if (target === 'spright') {
    componentPackageName = 'spright-components';
    destinationDirectory = path.resolve(__dirname, '../SprightBlazor/wwwroot');
} else {
    throw new Error(`Argument must be either 'nimble' or 'spright'. Received: ${target}`);
}

console.log(`Destination directory for blazor assets: "${destinationDirectory}"`);

const componentsPath = resolvePackagePath(`@ni/${componentPackageName}`);
const nimbleTokensPath = resolvePackagePath('@ni/nimble-tokens');

const componentsBasePath = path.resolve(componentsPath, 'dist');
const componentsSrcPattern = 'all-components-bundle.min.*';

const tokensBasePath = path.resolve(nimbleTokensPath, 'dist/fonts');
const tokensSrcPattern = '**';

console.log(`Copying components bundle from: "${componentsBasePath}\\${componentsSrcPattern}"`);
prepareDestinationDirectory(destinationDirectory, componentPackageName);
copyFiles(componentsBasePath, componentsSrcPattern, destinationDirectory, componentPackageName);
console.log(`Copying fonts from: "${tokensBasePath}\\${tokensSrcPattern}"`);
prepareDestinationDirectory(destinationDirectory, 'nimble-tokens');
copyFiles(tokensBasePath, tokensSrcPattern, destinationDirectory, 'nimble-tokens');

function resolvePackagePath(packageName) {
    return path.dirname(require.resolve(`${packageName}/package.json`));
}

function copyFiles(srcPath, srcPattern, destinationRootPath, destRelativeDirectory) {
    const sourcePaths = glob.sync(srcPattern, {
        // glob paths should only have forward slashes
        // so run glob in resolved path (which has backslashes on windows)
        cwd: srcPath,
        absolute: true,
        nodir: true
    });
    if (sourcePaths.length <= 0) {
        throw new Error(`No files found at path "${srcPath}/${srcPattern}"`);
    }
    for (const currentSrcPath of sourcePaths) {
        const destRelativePath = path.relative(srcPath, currentSrcPath);
        const destAbsolutePath = path.resolve(destinationRootPath, destRelativeDirectory, destRelativePath);
        const destAbsoluteDir = path.dirname(destAbsolutePath);
        if (!fs.existsSync(destAbsoluteDir)) {
            fs.mkdirSync(destAbsoluteDir, { recursive: true });
        }
        fs.copyFileSync(currentSrcPath, destAbsolutePath);
    }
}

function prepareDestinationDirectory(destinationRootPath, destRelativeDirectory) {
    const destDirectory = path.resolve(destinationRootPath, destRelativeDirectory);
    if (fs.existsSync(destDirectory)) {
        fs.rmSync(destDirectory, { recursive: true });
    }
    fs.mkdirSync(destDirectory, { recursive: true });
}
