import commonJS from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const umdDevelopmentPlugin = () => replace({
    'process.env.NODE_ENV': JSON.stringify('development'),
    preventAssignment: true
});

const umdProductionPlugin = () => replace({
    'process.env.NODE_ENV': JSON.stringify('production'),
    preventAssignment: true
});

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
            nodePolyfills(),
            sourcemaps(),
            resolve(),
            commonJS(),
            json()
        ]
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
            nodePolyfills(),
            sourcemaps(),
            resolve(),
            commonJS(),
            json()
        ]
    }
];
