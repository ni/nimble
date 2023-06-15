module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy({
        root: './',
        'landing/dist': './',
        '../../packages/nimble-components/dist/storybook': 'storybook',
        '../../packages/nimble-components/api-docs': 'storybook/api-docs',
        '../../angular-workspace/dist/example-client-app': 'storybook/example-client-app',
        '../../packages/nimble-blazor/dist/blazor-client-app': 'storybook/blazor-client-app'
    });
    eleventyConfig.setTemplateFormats([
        'md',
        'html',
    ]);
    return {
        dir: {
            input: 'src',
            output: 'dist'
        }
    };
};
