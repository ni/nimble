const fs = require('fs');
const path = require('path');

const workersDirectory = path.resolve(__dirname, '../../src/wafer-map/workers');

const matrixRendererBundlePath = path.resolve(__dirname, './dist/bundle/matrix-renderer.js');
const matrixRendererBundle = fs.readFileSync(matrixRendererBundlePath, 'utf-8');
const typesDTSPath = path.resolve(__dirname, './dist/esm/types.d.ts');
const typesDTS = fs.readFileSync(typesDTSPath, 'utf-8');
const matrixRendererTypesPath = path.resolve(__dirname, './dist/esm/matrix-renderer.d.ts');
const matrixRendererTypes = fs.readFileSync(
    matrixRendererTypesPath,
    'utf-8'
);

const workerCode = `export const workerCode = ${JSON.stringify(matrixRendererBundle)};`;

const workerCodeOutPath = path.resolve(workersDirectory, 'worker-code.ts');
const typesDTSOutPath = path.resolve(workersDirectory, 'types.ts');
const matrixRendererTypesOutPath = path.resolve(
    workersDirectory,
    'matrix-renderer.ts'
);

prepareDirectory(workersDirectory);
writeFile(workerCodeOutPath, workerCode);
writeFile(typesDTSOutPath, typesDTS);
writeFile(matrixRendererTypesOutPath, matrixRendererTypes);

function prepareDirectory(dirPath) {
    if (fs.existsSync(dirPath)) {
        console.log(`Deleting existing directory "${dirPath}"`);
        fs.rmSync(dirPath, { recursive: true });
        console.log('Finished deleting existing directory');
    }
    console.log(`Creating directory "${dirPath}"`);
    fs.mkdirSync(dirPath);
    console.log('Finished creating directory');
}

function writeFile(filePath, content) {
    console.log(`Writing file "${filePath}"`);
    fs.writeFileSync(filePath, content, { encoding: 'utf-8' });
    console.log('Finished writing file');
}
