import commonJS from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import filesize from 'rollup-plugin-filesize';
import { terser } from 'rollup-plugin-terser';
import transformTaggedTemplate from 'rollup-plugin-transform-tagged-template';
import typescript from 'rollup-plugin-typescript2';
import {
    transformCSSFragment,
    transformHTMLFragment
} from './build/transform-fragments';

const parserOptions = {
    sourceType: 'module'
};

// eslint-disable-next-line import/no-default-export
export default [
    {
        context: 'this',
        input: 'src/index-rollup.ts',
        output: [
            {
                file: 'dist/nimble-components.js',
                format: 'esm'
            },
            {
                file: 'dist/nimble-components.min.js',
                format: 'esm',
                plugins: [terser()]
            }
        ],
        plugins: [
            resolve(),
            commonJS(),
            typescript({
                tsconfigOverride: {
                    compilerOptions: {
                        declaration: false
                    }
                }
            }),
            transformTaggedTemplate({
                tagsToProcess: ['css'],
                transformer: transformCSSFragment,
                parserOptions
            }),
            transformTaggedTemplate({
                tagsToProcess: ['html'],
                transformer: transformHTMLFragment,
                parserOptions
            }),
            filesize({
                showMinifiedSize: false,
                showBrotliSize: true
            })
        ]
    }
];
