const fs = require('fs');
const path = require('path');

const moduleName = '../bundle/render-worker.js';
const healthCheckModuleName = '../../source/health-status.ts';

const workersDirectory = path.resolve('./src/wafer-map/workers');
if (fs.existsSync(workersDirectory)) {
    console.log(`Deleting existing workers directory "${workersDirectory}"`);
    fs.rmSync(workersDirectory, { recursive: true });
    console.log('Finished deleting existing workers directory');
}
console.log(`Creating workers directory "${workersDirectory}"`);
fs.mkdirSync(workersDirectory);
console.log('Finished creating workers directory');

const modulePath = require.resolve(moduleName);
const sourceCode = fs.readFileSync(modulePath, 'utf-8');

const healthModulePath = require.resolve(healthCheckModuleName);

const fileContent =
    `// eslint-disable-next-line no-template-curly-in-string
export const workerCode = ${JSON.stringify(sourceCode)};`;

const filePath = path.resolve(workersDirectory, 'render-worker.ts');
const healthFilePath = path.resolve(workersDirectory, 'health-status.ts');

console.log(`Writing worker file "${filePath}"`);
fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' });

fs.copyFile(healthModulePath, healthFilePath, (err: Error) => {
    if (err) throw err;
    console.log('source.txt was copied to destination.txt');
});

console.log('Finished writing worker file');
