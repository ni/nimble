module.exports = {
  ci: {
    collect: {
      staticDistDir: './angular-workspace/dist/example-client-app',
      numberOfRuns: 1,
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
