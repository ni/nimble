import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'node:path';

export default {
    input: path.resolve(import.meta.dirname, 'dist/esm/browser.js'),
    output: {
        file: path.resolve(import.meta.dirname, 'dist/browser-bundle.js'),
        format: 'iife',
        sourcemap: false
    },
    plugins: [nodeResolve()]
};
