var glob = require("glob");
var cpFile = require('cp-file');
var path = require('path');
var fs = require('fs');

var sourceDir = path.resolve('../../../dist/ni/nimble-angular');
var sources = [
  'bundles/**',
  'directives/**',
  'esm2015/**',
  'fesm2015/**',
  'ni-nimble-angular.d.ts',
  'public-api.d.ts'
];

var destinationDir = process.cwd();

for (var i = 0; i < sources.length; i++) {
  var filesToDelete = glob.sync(path.join(destinationDir, sources[i]), { nodir: true });
  for (var j = 0; j < filesToDelete.length; j++) {
    fs.unlinkSync(filesToDelete[j]);
  }

  var filesToCopy = glob.sync(path.join(sourceDir, sources[i]), { nodir: true });
  for (var j = 0; j < filesToCopy.length; j++) {
    var relativeSource = path.relative(sourceDir, filesToCopy[j]);
    cpFile.sync(filesToCopy[j], path.join(destinationDir, relativeSource));
  }
}

