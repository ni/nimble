const path = require('path');
const glob = require('glob');
const fs = require('fs');

const destinationDirectory = path.resolve(__dirname, '../NimbleBlazor/wwwroot');
console.log(`Destination directory for blazor assets: "${destinationDirectory}"`);

const nimbleComponentsPath = resolvePackagePath('@ni/nimble-components');
const nimbleTokensPath = resolvePackagePath('@ni/nimble-tokens');
const nimbleBlazorPath = resolvePackagePath('@ni/nimble-blazor');

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
createBlazorHybridWorkaroundFile();

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

function createBlazorHybridWorkaroundFile() {
    const srcPath = path.resolve(nimbleBlazorPath, 'NimbleBlazor/wwwroot');
    const srcPattern = { src: 'NimbleBlazor.lib.module.js' };
    const sourcePath = glob.sync(srcPattern.src, {
        cwd: srcPath,
        absolute: true,
        nodir: true
    })[0];
    const newFileName = 'NimbleBlazor.HybridWorkaround.js';
    const destAbsolutePath = path.resolve(destinationDirectory, newFileName);
    const destAbsoluteDir = path.dirname(destAbsolutePath);
    if (!fs.existsSync(destAbsoluteDir)) {
        fs.mkdirSync(destAbsoluteDir, { recursive: true });
    }
    fs.copyFileSync(sourcePath, destAbsolutePath);
    fs.readFile(destAbsolutePath, 'utf8', (err, data) => {
        if (!err) {
            const allLines = data.split('\n').map(v => {
                if (v.includes('DELETESTART')) {
                    return 'DELETESTARTFLAG';
                }

                if (v.includes('DELETEEND')) {
                    return 'DELETEENDFLAG';
                }

                return v;
            });
            const firstDeleteStartIndex = allLines.indexOf('DELETESTARTFLAG');
            const firstDeleteEndIndex = allLines.indexOf('DELETEENDFLAG');
            const lastDeleteStartIndex = allLines.lastIndexOf('DELETESTARTFLAG');
            const lastDeleteEndIndex = allLines.lastIndexOf('DELETEENDFLAG');
            if (lastDeleteStartIndex >= 0 && lastDeleteEndIndex >= 0) {
                allLines.splice(lastDeleteStartIndex, lastDeleteEndIndex + 1 - lastDeleteStartIndex);
            }
            if (firstDeleteStartIndex >= 0 && firstDeleteEndIndex >= 0) {
                allLines.splice(firstDeleteStartIndex, firstDeleteEndIndex + 1 - firstDeleteStartIndex);
            }
            fs.writeFile(destAbsolutePath, allLines.join('\n'), 'utf8', err2 => {
                console.log(err2);
            });
        }
    });
}

function prepareDestinationDirectory(destRelativeDirectory) {
    const destDirectory = path.resolve(destinationDirectory, destRelativeDirectory);
    if (fs.existsSync(destDirectory)) {
        fs.rmSync(destDirectory, { recursive: true });
    }
    fs.mkdirSync(destDirectory, { recursive: true });
}
