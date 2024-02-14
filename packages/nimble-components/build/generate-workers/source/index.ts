const fs = require('fs');
const path = require('path');

const moduleName = './render-worker.js';
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

const healthStatusSourcePath = require.resolve(healthStatusFileName);
const healthStatusContent = fs.readFileSync(healthStatusSourcePath, 'utf-8');

const modulePath = require.resolve(moduleName);
const sourceCode = fs.readFileSync(modulePath, 'utf-8');

const combinedFileContents =
`/* eslint-disable no-useless-escape */
export const workerCode = \`
${healthStatusContent}
${sourceCode.replaceAll('`','\\`').replaceAll('$','\\$').replaceAll('exports.RenderWorker = RenderWorker;','')}
\`;`;

const filePath = path.resolve(workersDirectory, 'render-worker.ts');
console.log(`Writing worker file "${filePath}"`);
fs.writeFileSync(filePath, combinedFileContents, { encoding: 'utf-8' });
console.log('Finished writing worker file');