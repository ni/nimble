import nodeResolve from '@rollup/plugin-node-resolve';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default {
    input: path.resolve(__dirname, 'dist/esm/matrix-renderer.js'),
    output: {
        file: path.resolve(__dirname, 'dist/bundle/matrix-renderer.js'),
        format: 'es',
        name: 'MatrixRenderer',
        sourcemap: false
    },
    plugins: [nodeResolve()]
};
