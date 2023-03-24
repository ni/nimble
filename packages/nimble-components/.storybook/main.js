const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    stories: ['../src/**/*.stories.@(ts|mdx)', '../docs/**/*.stories.mdx'],
    addons: [
        {
            name: '@storybook/addon-essentials',
            options: {
                outline: false
            }
        },
        '@storybook/addon-a11y',
        '@storybook/addon-interactions'
    ],
    webpackFinal: config => {
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
    },
    staticDirs: ['public'],
    framework: {
        name: '@storybook/html-webpack5',
        options: {}
    },
    docs: {
        autodocs: false
    }
};
