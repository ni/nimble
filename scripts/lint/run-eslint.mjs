#!/usr/bin/env node
/* eslint-env node */
import path from 'node:path';
import { spawn } from 'node:child_process';

const workspaceCwd = process.cwd();
const cacheLocation = process.env.ESLINT_CACHE_LOCATION
    ? path.resolve(workspaceCwd, process.env.ESLINT_CACHE_LOCATION)
    : path.join(workspaceCwd, '.eslintcache');
const userArgs = process.argv.slice(2);

const eslintArgs = [
    'eslint',
    '--cache',
    '--cache-location',
    cacheLocation,
    ...userArgs
];

const npxCommand = process.platform === 'win32' ? 'npx.cmd' : 'npx';

const child = spawn(npxCommand, eslintArgs, {
    stdio: 'inherit',
    cwd: workspaceCwd,
    env: {
        ...process.env,
        ESLINT_CACHE_LOCATION: cacheLocation
    }
});

child.on('close', (code) => {
    process.exit(code ?? 1);
});

child.on('error', (error) => {
    console.error('[run-eslint]', error);
    process.exit(1);
});
