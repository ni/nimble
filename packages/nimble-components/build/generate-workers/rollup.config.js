import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';

export default {
    input: path.resolve(__dirname, 'dist/esm/source/matrix-renderer.js'),
    output: {
        file: path.resolve(__dirname, 'dist/bundle/matrix-renderer.js'),
        format: 'iife',
        name: 'MatrixRenderer',
        sourcemap: false
    },
    plugins: [nodeResolve()]
};