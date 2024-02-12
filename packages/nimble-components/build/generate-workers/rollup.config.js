import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const path = require('path');

export default [
    {
        input: path.resolve(__dirname, 'source/renderWorker.ts'),
        output: {
            file: path.resolve(__dirname, 'dist/renderWorker.js'),
            format: 'cjs'
        },
        plugins: [resolve(), commonjs(), typescript({
            tsconfig: 'build/generate-workers/tsconfig.json'
        })]
    },
    {
        input: path.resolve(__dirname, 'source/index.ts'),
        output: {
            file: path.resolve(__dirname, 'dist/index.js'),
            format: 'cjs'
        },
        plugins: [resolve(), commonjs(), typescript({
            tsconfig: 'build/generate-workers/tsconfig.json'
        })]
    }
];
