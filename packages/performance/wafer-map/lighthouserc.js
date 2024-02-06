module.exports = {
    ci: {
        collect: {
            staticDistDir: '../dist/wafer-map',
            numberOfRuns: 1,
            settings: {
                onlyAudits: ['user-timings']
            }
        },
        upload: {
            target: 'temporary-public-storage',
        },
    },
};
