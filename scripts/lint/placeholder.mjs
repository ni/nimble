#!/usr/bin/env node
import { fileURLToPath } from 'url';
import path from 'path';

const [, , command = 'lint'] = process.argv;
const relativePath = path.relative(process.cwd(), fileURLToPath(import.meta.url));

console.log(
    `The ${command} workflow is not available yet. This placeholder (${relativePath}) exists while the Lage migration is in progress.`
);
console.log('Please follow the tasks in specs/002-lint-speedup/tasks.md to complete the implementation.');
process.exitCode = 1;
