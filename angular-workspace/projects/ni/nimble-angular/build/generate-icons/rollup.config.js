// eslint-disable-next-line import/no-extraneous-dependencies
import { nodeResolve } from '@rollup/plugin-node-resolve';

// eslint-disable-next-line import/no-default-export
export default {
    input: 'projects/ni/nimble-angular/build/generate-icons/source/index.js',
    output: {
        file: 'projects/ni/nimble-angular/build/generate-icons/dist/index.js',
        format: 'cjs'
    },
    plugins: [nodeResolve()]
};
