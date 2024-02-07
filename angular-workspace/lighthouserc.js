module.exports = {
    ci: {
        collect: {
            // Serve from dist folder so Angular project name is part of url path
            // and shows up in GitHub status checks
            staticDistDir: './dist/',
            url: [
                'http://localhost/example-client-app/#/customapp'
            ],
            numberOfRuns: 3,
            settings: {
                // Omit the pwa category
                onlyCategories: ['accessibility', 'best-practices', 'performance', 'seo']
            }
        },
        assert: {
            assertions: {
                'categories:performance': ['warn', { minScore: 0.9 }],
                // TODO: reset to 0.9 as part of https://github.com/ni/nimble/issues/1090
                // TODO: reset to error as part of https://github.com/ni/nimble/issues/1650
                'categories:accessibility': ['warn', { minScore: 0.88 }]
            }
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
