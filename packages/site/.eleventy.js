module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy({
        root: './',
        // 'landing/dist': './', only for testing purposes
        '../../packages/nimble-components/dist/storybook': 'storybook',
        '../../angular-workspace/dist/example-client-app': 'storybook/example-client-app',
        '../../packages/nimble-blazor/dist/blazor-client-app': 'storybook/blazor-client-app',
        '../../packages/performance/landing/dist': './', // only for testing purposes
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
