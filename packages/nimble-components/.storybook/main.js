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
    webpackFinal: async config => {
        config.performance = {
            hints: false
        };

        return config;
    }
};
