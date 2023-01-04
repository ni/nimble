import commonJS from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

const umdDevelopmentPlugin = () => replace({
    'process.env.NODE_ENV': JSON.stringify('development')
});

const umdProductionPlugin = () => replace({
    'process.env.NODE_ENV': JSON.stringify('production')
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
        plugins: [umdDevelopmentPlugin(), sourcemaps(), resolve(), commonJS()]
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
        plugins: [umdProductionPlugin(), sourcemaps(), resolve(), commonJS()]
    }
];
