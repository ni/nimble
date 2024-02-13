
const fs = require('fs');
const path = require('path');

const moduleName = './renderWorker.js';

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

const componentFileContents =
`export const workerCode = \`
${sourceCode.replaceAll('`','\\`').replaceAll('$','\\$').replaceAll('exports.RenderWorker = RenderWorker;','')}
\`;`;

const filePath = path.resolve(workersDirectory, 'renderWorker.ts');
console.log(`Writing worker file "${filePath}"`);
fs.writeFileSync(filePath, componentFileContents, { encoding: 'utf-8' });
console.log('Finished writing worker file');