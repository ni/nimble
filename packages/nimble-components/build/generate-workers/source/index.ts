const fs = require('fs');
const path = require('path');

const moduleName = '../bundle/render-worker.js';
const healthStatusFileName = './health-status.js';

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

const fileContent =
`// eslint-disable-next-line no-template-curly-in-string
export const workerCode = ${JSON.stringify(sourceCode)};`;

const filePath = path.resolve(workersDirectory, 'render-worker.ts');
console.log(`Writing worker file "${filePath}"`);
fs.writeFileSync(filePath, fileContent, { encoding: 'utf-8' });
console.log('Finished writing worker file');