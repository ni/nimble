const path = require('path');
const fs = require('fs');

const sourceFile = path.resolve(__dirname, '../dist/fonts/css/fonts.css');
console.log(`Source file for fonts.css: "${sourceFile}"`);

const destinationDirectory = path.resolve(__dirname, '../dist/fonts/scss');
console.log(`Destination directory for fonts.scss: "${destinationDirectory}"`);

const destinationFile = path.resolve(destinationDirectory, './fonts.scss');
console.log(`Destination file for fonts.scss: "${destinationFile}"`);

console.log('Creating destination directory if needed');
if (!fs.existsSync(destinationDirectory)) {
    console.log('Created destination directory');
    fs.mkdirSync(destinationDirectory, { recursive: true });
}

console.log('Loading source file');
const sourceFileContents = fs.readFileSync(sourceFile);

console.log('Writing destination file');
fs.writeFileSync(destinationFile, sourceFileContents);
