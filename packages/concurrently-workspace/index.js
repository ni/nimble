#! /usr/bin/env node

const concurrently = require("concurrently");
const fs = require('fs');
const path = require('path');

const workingDirectory = process.cwd();
console.log(`Working directory: ${workingDirectory}`);
const workspacePackage = JSON.parse(fs.readFileSync(path.resolve(workingDirectory, 'package.json')));
const workspaces = workspacePackage.workspaces;
console.log(`Found workspace entries: ${workspaces.join(', ')}`);
const script = process.argv[2]
console.log(`Script to run ${script}`);

concurrently(workspaces.map((workspace) => ({
    command: `npm run ${script} -w ${workspace} --if-present`,
    name: `${workspace}:${script}`,
})), {
    cwd: workingDirectory,
    group: true,
    timings: true,
    maxProcesses: 2
}).result.catch(e => {
    console.error('Commands had non-zero exit codes');
    process.exit(1);
});
