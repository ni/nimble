import remarkGfm from 'remark-gfm';
import CircularDependencyPlugin from 'circular-dependency-plugin';

export const stories = [
    '../docs/**/*.mdx',
    '../src/**/*.mdx',
    '../src/**/*.stories.ts'
];
export const addons = [
    {
        name: '@storybook/addon-essentials',
        options: {
            outline: false
        }
    },
    {
        name: '@storybook/addon-docs',
        options: {
            mdxPluginOptions: {
                mdxCompileOptions: {
                    remarkPlugins: [remarkGfm]
                }
            }
        }
    },
    '@storybook/addon-a11y',
    '@storybook/addon-interactions'
];
export function webpackFinal(config) {
    config.module.rules.push({
        test: /\.ts$/,
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
    return config;
}
export const staticDirs = ['public'];
export const framework = {
    name: '@storybook/html-webpack5',
    options: {}
};
