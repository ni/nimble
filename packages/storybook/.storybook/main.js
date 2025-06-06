import { dirname, join } from 'path';
import remarkGfm from 'remark-gfm';
import CircularDependencyPlugin from 'circular-dependency-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import TsconfigPathsPlugin from 'tsconfig-paths-webpack-plugin';

// All files participating in storybook should be in src
// so that TypeScript and linters can track them correctly
export const stories = [
    '../src/docs',
    '../src/nimble',
    '../src/spright'
];
export const addons = [{
        name: getAbsolutePath("@storybook/addon-docs"),
        options: {
            mdxPluginOptions: {
                mdxCompileOptions: {
                    remarkPlugins: [remarkGfm]
                }
            }
        }
    }, getAbsolutePath('@storybook/addon-a11y'), getAbsolutePath('@chromatic-com/storybook'), getAbsolutePath('@storybook/addon-webpack5-compiler-swc'), getAbsolutePath('storybook-addon-pseudo-states')];

export function webpackFinal(config) {
    config.module.rules.push({
        test: /\.(ts|tsx)$/,
        use: [
            {
                loader: 'ts-loader'
            }
        ]
    });
    config.resolve.plugins = [
        new TsconfigPathsPlugin(),
    ];
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
    name: getAbsolutePath('@storybook/html-vite')
};

function getAbsolutePath(value) {
    return dirname(require.resolve(join(value, 'package.json')));
}
