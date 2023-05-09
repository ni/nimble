import commonJS from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';
import terser from '@rollup/plugin-terser';
import replace from '@rollup/plugin-replace';
import { visualizer } from "rollup-plugin-visualizer";

const umdDevelopmentPlugin = () => replace({
    'process.env.NODE_ENV': JSON.stringify('development')
});

const umdProductionPlugin = () => replace({
    'process.env.NODE_ENV': JSON.stringify('production')
});

// eslint-disable-next-line import/no-default-export
export default [
    {
        input: 'src/all-components.js',
        output: {
            file: 'dist/all-components-bundle.js',
            format: 'iife',
            sourcemap: true
        },
        plugins: [umdDevelopmentPlugin(), sourcemaps(), resolve(), commonJS(), visualizer({
            // The plugin looks at the original source files, so only run once
            filename: 'dist/stats.html'
        })]
    },
    {
        input: 'src/all-components.js',
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
