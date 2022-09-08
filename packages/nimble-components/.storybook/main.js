const CircularDependencyPlugin = require('circular-dependency-plugin');

module.exports = {
    core: {
        builder: 'webpack5'
    },
    stories: ['../src/**/*.stories.@(ts|mdx)', '../docs/**/*.stories.mdx'],
    addons: [
        {
            name: '@storybook/addon-essentials',
            options: {
                outline: false
            }
        },
        'storybook-addon-xd-designs',
        '@storybook/addon-a11y',
        '@storybook/addon-interactions'
    ],
    features: {
        previewCsfV3: true
    },
    webpackFinal: async config => {
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
    staticDirs: ['public']
};
