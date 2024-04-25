import { nodeResolve } from '@rollup/plugin-node-resolve';

const path = require('path');

export default {
    input: path.resolve(__dirname, 'source/SprightBlazor.HybridWorkaround.js'),
    output: {
        file: path.resolve(__dirname, '../../wwwroot/SprightBlazor.HybridWorkaround.js'),
        format: 'iife'
    },
    plugins: [nodeResolve()]
};