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

const renderModuleName: string = '../bundle/matrix-renderer.js';
const workerTypes: string = '../esm/source/types.d.ts';
const matrixRendererTypes: string = '../esm/source/matrix-renderer.d.ts';
const workersDirectory: string = path.resolve('./src/wafer-map/workers');

prepareDirectory(workersDirectory);

const modulePath: string = resolveModulePath(renderModuleName);
const sourceCode: string = fs.readFileSync(modulePath, 'utf-8');
const workerTypesPath: string = resolveModulePath(workerTypes);
const workerTypesCode: string = fs.readFileSync(workerTypesPath, 'utf-8');
const matrixRendererTypesPath: string = resolveModulePath(matrixRendererTypes);
const matrixRendererTypesCode: string = fs.readFileSync(matrixRendererTypesPath, 'utf-8');

const fileContent: string = `// eslint-disable-next-line no-template-curly-in-string
export const workerCode = ${JSON.stringify(sourceCode)};
`;

const renderFilePath: string = path.resolve(
    workersDirectory,
    'worker-code.ts'
);

const workersFilePath: string = path.resolve(workersDirectory, 'types.ts');
const matrixRendererFilePath: string = path.resolve(workersDirectory, 'matrix-renderer.ts');

writeFile(renderFilePath, fileContent);
writeFile(workersFilePath, workerTypesCode);
writeFile(matrixRendererFilePath, matrixRendererTypesCode);
