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
                preset: 'desktop',
                // Omit the pwa category
                onlyCategories: ['accessibility', 'best-practices', 'performance', 'seo']
            }
        },
        assert: {
            assertions: {
                'categories:performance': ['error', { minScore: 0.9 }],
                'categories:accessibility': ['error', { minScore: 0.8 }]
            }
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
