import { dirname, join } from 'path';
import remarkGfm from 'remark-gfm';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import TerserPlugin from 'terser-webpack-plugin';

// All files participating in storybook should be in src
// so that TypeScript and linters can track them correctly
export const stories = ['../src/**/*.mdx', '../src/**/*.stories.ts'];
export const addons = [
    {
        name: getAbsolutePath('@storybook/addon-essentials'),
        options: {
            outline: false,
            docs: false
        }
    },
    {
        name: getAbsolutePath('@storybook/addon-docs'),
        options: {
            mdxPluginOptions: {
                mdxCompileOptions: {
                    remarkPlugins: [remarkGfm]
                }
            }
        }
    },
    getAbsolutePath('@storybook/addon-a11y'),
    getAbsolutePath('@storybook/addon-interactions'),
    getAbsolutePath('@chromatic-com/storybook'),
    getAbsolutePath('@storybook/addon-webpack5-compiler-swc'),
    getAbsolutePath('storybook-addon-pseudo-states')
];
export function webpackFinal(config) {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            {
                loader: require.resolve('ts-loader')
            }
        ]
    });
    config.plugins.push(
        new CircularDependencyPlugin({
            exclude: /node_modules/,
            failOnError: process.env.NODE_ENV === 'production'
        })
    );
    config.performance = {
        hints: false
    };
    config.optimization.minimizer = [
        new TerserPlugin({
            terserOptions: {
                keep_classnames: true,
                keep_fnames: true
            }
        })
    ];
    return config;
}
export const staticDirs = ['public'];
export const framework = {
    name: getAbsolutePath('@storybook/html-webpack5')
};

export const docs = {
    autodocs: false
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
