import commonJS from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';

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
export default [
    {
        input: 'dist/esm/all-components.js',
        output: {
            file: 'dist/all-components-bundle.js',
            format: 'iife',
            sourcemap: true
        },
        plugins: [
            umdDevelopmentPlugin(),
            sourcemaps(),
            resolve(),
            commonJS(),
            json()
        ],
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
        plugins: [
            umdProductionPlugin(),
            sourcemaps(),
            resolve(),
            commonJS(),
            json()
        ],
        onwarn
    }
];
