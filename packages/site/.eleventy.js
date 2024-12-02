module.exports = eleventyConfig => {
    eleventyConfig.addPassthroughCopy({
        root: './',
        'landing/dist': './',
        '../../packages/storybook/dist/storybook': 'storybook',
        '../../packages/angular-workspace/dist/example-client-app': 'storybook/example-client-app',
        '../../packages/blazor-workspace/dist/blazor-client-app': 'storybook/blazor-client-app',
        '../../packages/performance/dist': 'storybook/performance'
    });
    eleventyConfig.setTemplateFormats([
    ]);
    return {
        dir: {
            input: '.',
            output: 'dist'
        }
    };
};
