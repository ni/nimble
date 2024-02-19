const fs = require('fs');
const path = require('path');

function resolveModulePath(moduleName: string): string {
    return path.resolve(require.resolve(moduleName));
}

function prepareDirectory(dirPath: string): void {
    if (fs.existsSync(dirPath)) {
        console.log(`Deleting existing directory "${dirPath}"`);
        fs.rmSync(dirPath, { recursive: true });
        console.log('Finished deleting existing directory');
    }
    console.log(`Creating directory "${dirPath}"`);
    fs.mkdirSync(dirPath);
    console.log('Finished creating directory');
}

function writeFile(filePath: string, content: string): void {
    console.log(`Writing file "${filePath}"`);
    fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
    console.log('Finished writing file');
}

function copyFile(sourcePath: string, destinationPath: string): void {
    console.log(`Copying file from "${sourcePath}" to "${destinationPath}"`);
    fs.copyFileSync(sourcePath, destinationPath);
    console.log('Finished copying file');
}

const renderModuleName: string = '../bundle/render-worker.js';
const healthStatusModuleName: string = '../../source/health-status.ts';
const workersDirectory: string = path.resolve('./src/wafer-map/workers');

prepareDirectory(workersDirectory);

const modulePath: string = resolveModulePath(renderModuleName);
const sourceCode: string = fs.readFileSync(modulePath, 'utf-8');

const healthModulePath: string = resolveModulePath(healthStatusModuleName);

const fileContent: string = `// eslint-disable-next-line no-template-curly-in-string\nexport const workerCode = ${JSON.stringify(sourceCode)};`;

const renderFilePath: string = path.resolve(workersDirectory, 'render-worker.ts');
const healthFilePath: string = path.resolve(workersDirectory, 'health-status.ts');

writeFile(renderFilePath, fileContent);
copyFile(healthModulePath, healthFilePath);
