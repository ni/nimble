module.exports = {
    ci: {
        collect: {
            staticDistDir: './landing/dist',
            numberOfRuns: 1,
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
