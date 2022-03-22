import commonJS from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import { terser } from 'rollup-plugin-terser';
import transformTaggedTemplate from 'rollup-plugin-transform-tagged-template';
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
        input: 'dist/esm/all-components.js',
        output: {
            file: 'dist/all-components-bundle.js',
            format: 'esm',
            sourcemap: true
        },
        plugins: [
            resolve(),
            commonJS()
        ]
    },
    {
        input: 'dist/esm/all-components.js',
        output: {
            file: 'dist/all-components-bundle.min.js',
            format: 'esm',
            sourcemap: true,
            plugins: [
                terser({
                    output: {
                        semicolons: false
                    }
                })
            ]
        },
        plugins: [
            resolve(),
            commonJS(),
            transformTaggedTemplate({
                tagsToProcess: ['css'],
                transformer: transformCSSFragment,
                parserOptions
            }),
            transformTaggedTemplate({
                tagsToProcess: ['html'],
                transformer: transformHTMLFragment,
                parserOptions
            })
        ]
    }
];
