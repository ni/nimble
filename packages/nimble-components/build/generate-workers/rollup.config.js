import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const path = require('path');

export default [
    {
        input: path.resolve(__dirname, 'source/health-status.ts'),
        output: {
            file: path.resolve(__dirname, 'dist/health-status.js'),
            format: 'iife',
            name: 'HealthStatus',
            sourcemap: false
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: path.resolve(__dirname, 'source/render-worker.ts'),
        output: {
            file: path.resolve(__dirname, 'dist/render-worker.js'),
            format: 'iife',
            name: 'RenderWorker',
            sourcemap: false
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: path.resolve(__dirname, 'source/index.ts'),
        output: {
            file: path.resolve(__dirname, 'dist/index.js'),
            format: 'iife',
            name: 'Main',
            sourcemap: false
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: path.resolve(__dirname, 'source/tests/render-worker.spec.ts'),
        output: {
            file: path.resolve(__dirname, 'dist/tests/render-worker.spec.js'),
            format: 'iife',
            name: 'RenderWorkerTest',
            sourcemap: false
        },
        plugins: [resolve(), commonjs()]
    }
];