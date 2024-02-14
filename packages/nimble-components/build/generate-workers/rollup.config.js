import typescript from '@rollup/plugin-typescript';
import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const path = require('path');

export default [
    {
        input: path.resolve(__dirname, 'source/health-status.ts'),
        output: {
            file: path.resolve(__dirname, 'dist/health-status.js'),
            format: 'iife'
        },
        plugins: [resolve(), commonjs(), typescript({
            tsconfig: 'build/generate-workers/tsconfig.json'
        })]
    },
    {
        input: path.resolve(__dirname, 'source/render-worker.ts'),
        output: {
            file: path.resolve(__dirname, 'dist/render-worker.js'),
            format: 'iife'
        },
        plugins: [resolve(), commonjs(), typescript({
            tsconfig: 'build/generate-workers/tsconfig.json'
        })]
    },
    {
        input: path.resolve(__dirname, 'source/index.ts'),
        output: {
            file: path.resolve(__dirname, 'dist/index.js'),
            format: 'iife'
        },
        plugins: [resolve(), commonjs(), typescript({
            tsconfig: 'build/generate-workers/tsconfig.json'
        })]
    }
];