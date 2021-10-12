var glob = require("glob");
var cpFile = require('cp-file');
var path = require('path');
var fs = require('fs');

/**
 * We want to publish out of the project directory, not the build output (dist) directory. Angular
 * seems to encourage publishing out of the dist directory, by copying the package.json and README
 * to that directory. But the Beachball tooling doesn't publish packages that aren't tracked by git
 * (which the dist directory is not). So instead, we copy the build output to the project directory
 * before packing so that it can be included.
 */

const sourceDir = path.resolve('../../../dist/ni/nimble-angular');
const sources = [
  'bundles/**',
  'directives/**',
  'esm2015/**',
  'fesm2015/**',
  'ni-nimble-angular.d.ts',
  'public-api.d.ts'
];
const destinationDir = process.cwd();

for (const source of sources) {
  const filesToDelete = glob.sync(path.join(destinationDir, source), { nodir: true });
  for (const fileToDelete of filesToDelete) {
    fs.unlinkSync(fileToDelete);
  }

  const filesToCopy = glob.sync(path.join(sourceDir, source), { nodir: true });
  for (const fileToCopy of filesToCopy) {
    const relativeSource = path.relative(sourceDir, fileToCopy);
    cpFile.sync(fileToCopy, path.join(destinationDir, relativeSource));
  }
}

