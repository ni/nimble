import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';

const path = require('path');

export default [
    {
        input: path.resolve(__dirname, 'build/health-status.js'),
        output: {
            file: path.resolve(__dirname, 'dist/health-status.js'),
            format: 'iife',
            name: 'HealthStatus',
            sourcemap: false
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: path.resolve(__dirname, 'build/render-worker.js'),
        output: {
            file: path.resolve(__dirname, 'dist/render-worker.js'),
            format: 'iife',
            name: 'RenderWorker',
            sourcemap: false
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: path.resolve(__dirname, 'build/index.js'),
        output: {
            file: path.resolve(__dirname, 'dist/index.js'),
            format: 'iife',
            name: 'Index',
            sourcemap: false
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: path.resolve(__dirname, 'build/tests/render-worker.spec.js'),
        output: {
            file: path.resolve(__dirname, 'dist/tests/render-worker.spec.js'),
            format: 'iife',
            name: 'RenderWorkerSpec',
            sourcemap: false
        },
        plugins: [resolve(), commonjs()]
    }
];
