module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy({
        root: './',
        'landing/dist': './',
        '../../packages/nimble-components/dist/storybook': 'storybook/nimble',
        '../../angular-workspace/dist/example-client-app': 'storybook/nimble/example-client-app',
        '../../packages/nimble-blazor/dist/blazor-client-app': 'storybook/nimble/blazor-client-app',
        '../../packages/spright-components/dist/storybook': 'storybook/spright',
        '../../packages/performance/dist': 'storybook/performance'
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
