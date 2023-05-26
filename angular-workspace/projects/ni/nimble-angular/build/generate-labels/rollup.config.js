import { nodeResolve } from '@rollup/plugin-node-resolve';
import json from '@rollup/plugin-json';

const path = require('path');

export default {
    input: path.resolve(__dirname, 'source/index.js'),
    output: {
        file: path.resolve(__dirname, 'dist/index.js'),
        format: 'cjs'
    },
    plugins: [nodeResolve(), json()]
};
