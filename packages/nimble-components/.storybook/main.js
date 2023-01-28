module.exports = {
    core: {
        builder: '@storybook/builder-vite'
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
        previewCsfV3: true,
        previewMdx2: true
    },
    staticDirs: ['public']
};
