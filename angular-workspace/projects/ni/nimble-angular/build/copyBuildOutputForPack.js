const glob = require('glob');
const cpFile = require('cp-file');
const path = require('path');
const fs = require('fs');

/**
 * We want to publish out of the project directory, not the build output (dist) directory. Angular
 * seems to encourage publishing out of the dist directory, by copying the package.json and README
 * to that directory. But the Beachball tooling only publishes packages that are tracked by git
 * (which the dist directory is not). So instead, we copy the build output to the project directory
 * before packing so that it can be included.
 */

const sourceDir = path.resolve(__dirname, '../../../../dist/ni/nimble-angular');
const sources = [
    'bundles/**',
    'directives/**',
    'esm2015/**',
    'fesm2015/**',
    'ni-nimble-angular.d.ts',
    'public-api.d.ts'
];
const destinationDir = path.resolve(__dirname, '../');

const deleteCopiedFiles = () => {
    console.log('Deleting existing pack files');
    for (const source of sources) {
        const filesToDelete = glob.sync(path.join(destinationDir, source), { nodir: true });
        for (const fileToDelete of filesToDelete) {
            fs.unlinkSync(fileToDelete);
        }
    }
};

const copyFiles = () => {
    console.log('Copying new pack files');
    for (const source of sources) {
        const filesToCopy = glob.sync(path.join(sourceDir, source), { nodir: true });
        for (const fileToCopy of filesToCopy) {
            const relativeSource = path.relative(sourceDir, fileToCopy);
            cpFile.sync(fileToCopy, path.join(destinationDir, relativeSource));
        }
    }
};

const arg = process.argv[2] || '';
const clean = arg.toLowerCase() === 'clean';

if (clean) {
    console.log('*** Clean nimble-angular build output after pack ***');
    console.log(`Cleaning copied files from: ${destinationDir}`);
    deleteCopiedFiles();
    console.log('Completed cleaning files after pack');
    console.log();
} else {
    console.log('*** Copy nimble-angular build output for pack ***');
    console.log(`Source directory: ${sourceDir}`);
    console.log(`Destination directory: ${destinationDir}`);
    deleteCopiedFiles();
    copyFiles();
    console.log('Completed copying files for pack');
    console.log();
}