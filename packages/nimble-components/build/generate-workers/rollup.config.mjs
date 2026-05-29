import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';

export default {
    input: path.resolve(import.meta.dirname, 'dist/esm/matrix-renderer.js'),
    output: {
        file: path.resolve(import.meta.dirname, 'dist/bundle/matrix-renderer.js'),
        format: 'iife',
        name: 'MatrixRenderer',
        sourcemap: false
    },
    plugins: [nodeResolve()]
};
