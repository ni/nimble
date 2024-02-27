import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';

export default {
    input: path.resolve(__dirname, 'dist/esm/source/render-worker.js'),
    output: {
        file: path.resolve(__dirname, 'dist/bundle/render-worker.js'),
        format: 'iife',
        name: 'RenderWorker',
        sourcemap: false
    },
    plugins: [nodeResolve()]
};