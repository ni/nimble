'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var commonJS = require('@rollup/plugin-commonjs');
var resolve = require('@rollup/plugin-node-resolve');
var sourcemaps = require('rollup-plugin-sourcemaps2');
var terser = require('@rollup/plugin-terser');
var replace = require('@rollup/plugin-replace');

const umdDevelopmentPlugin = () => replace({
    'process.env.NODE_ENV': JSON.stringify('development'),
    preventAssignment: true
});

const umdProductionPlugin = () => replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true
});

// Custom onwarn handler for ignoring specific warnings:
// https://rollupjs.org/configuration-options/#onwarn
const onwarn = (warning, defaultHandler) => {
    const ignoredWarnings = [
        // d3 has circular dependencies it won't remove:
        // See https://github.com/d3/d3-selection/issues/168
        {
            code: 'CIRCULAR_DEPENDENCY',
            file: 'node_modules/d3-'
        },
        // apache-arrow has circular dependencies:
        // See https://github.com/apache/arrow/issues/40516
        {
            code: 'CIRCULAR_DEPENDENCY',
            file: 'node_modules/apache-arrow'
        }
    ];

    if (
        !ignoredWarnings.some(
            ({ code, file }) => warning.code === code && warning.message.includes(file)
        )
    ) {
        defaultHandler(warning);
    }
};

// eslint-disable-next-line import/no-default-export
var rollup_config = [
    {
        input: 'dist/esm/all-components.js',
        output: {
            file: 'dist/all-components-bundle.js',
            format: 'iife',
            sourcemap: true
        },
        plugins: [umdDevelopmentPlugin(), sourcemaps(), resolve(), commonJS()],
        onwarn
    },
    {
        input: 'dist/esm/all-components.js',
        output: {
            file: 'dist/all-components-bundle.min.js',
            format: 'iife',
            sourcemap: true,
            plugins: [
                terser({
                    output: {
                        semicolons: false
                    }
                })
            ]
        },
        plugins: [umdProductionPlugin(), sourcemaps(), resolve(), commonJS()],
        onwarn
    }
];

exports.default = rollup_config;
