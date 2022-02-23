import { nodeResolve } from '@rollup/plugin-node-resolve';

// eslint-disable-next-line import/no-default-export
export default {
    input: 'build/generate-icons/source/index.js',
    output: {
        file: 'build/generate-icons/dist/index.js',
        format: 'cjs'
    },
    plugins: [nodeResolve()]
};
