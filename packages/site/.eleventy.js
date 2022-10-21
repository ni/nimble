module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy({
        root: './',
        '../../packages/nimble-components/dist/storybook': 'storybook',
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
