module.exports = {
    ci: {
        collect: {
            // Serve outside package so that package name is part of url path
            // and shows up in GitHub status checks
            staticDistDir: '../',
            url: [
                'http://localhost/performance/dist/wafer-map/'
            ],
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
