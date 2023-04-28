import { nodeResolve } from '@rollup/plugin-node-resolve';

const path = require('path');

export default {
    input: path.resolve(__dirname, 'source/NimbleBlazor.HybridWorkaround.js'),
    output: {
        file: path.resolve(__dirname, '../../NimbleBlazor/wwwroot/NimbleBlazor.HybridWorkaround.js'),
        format: 'iife'
    },
    plugins: [nodeResolve()]
};
