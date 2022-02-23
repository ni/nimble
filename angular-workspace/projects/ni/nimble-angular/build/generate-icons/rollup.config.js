import { nodeResolve } from '@rollup/plugin-node-resolve';

export default {
    input: 'projects/ni/nimble-angular/build/generate-icons/source/index.js',
    output: {
        file: 'projects/ni/nimble-angular/build/generate-icons/dist/index.js',
        format: 'cjs'
    },
    plugins: [nodeResolve()]
};
