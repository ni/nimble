const commonjs = require('@rollup/plugin-commonjs');
const resolve = require('@rollup/plugin-node-resolve');
const path = require('path');

export default [
    {
        input: path.resolve(__dirname, 'dist/health-status.js'),
        output: {
            file: path.resolve(__dirname, 'dist/bundles/health-status.js'),
            format: 'iife',
            sourcemap: false,
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: path.resolve(__dirname, 'dist/render-worker.js'),
        output: {
            file: path.resolve(__dirname, 'dist/bundles/render-worker.js'),
            format: 'iife',
            sourcemap: false,
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: path.resolve(__dirname, 'dist/index.js'),
        output: {
            file: path.resolve(__dirname, 'dist/bundles/index.js'),
            format: 'iife',
            sourcemap: false,
        },
        plugins: [resolve(), commonjs()]
    },
    {
        input: path.resolve(__dirname, 'dist/tests/render-worker.spec.js'),
        output: {
            file: path.resolve(__dirname, 'dist/bundles/tests/render-worker.spec.js'),
            format: 'iife',
            sourcemap: false,
        },
        plugins: [resolve(), commonjs()]
    }
];
