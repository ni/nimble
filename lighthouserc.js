module.exports = {
  ci: {
    collect: {
      staticDistDir: './angular-workspace/dist/example-client-app',
      url: [
        'http://localhost:58452/index.html#/login',
        'http://localhost:58452/index.html#/customapp'
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.85}]
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
