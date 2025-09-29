import { nodeResolve } from '@rollup/plugin-node-resolve';
import path from 'path';

export default {
    input: path.resolve(__dirname, 'source/index.js'),
    output: {
        file: path.resolve(__dirname, 'dist/index.js'),
        format: 'es'
    },
    plugins: [nodeResolve()]
};
