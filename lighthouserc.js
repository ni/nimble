module.exports = {
  ci: {
    collect: {
      staticDistDir: './angular-workspace/dist/example-client-app',
      isSinglePageApplication: true,
      url: [
        'http://localhost:58452/#/login',
        'http://localhost:58452/#/customapp'
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.9}]
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
