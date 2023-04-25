module.exports = {
  ci: {
    collect: {
      staticDistDir: './angular-workspace/dist/example-client-app',
      url: [
        'http://localhost:58452/#/customapp'
      ],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['warn', {minScore: 0.9}],
        'categories:accessibility': ['error', {minScore: 0.88}] // TODO: reset to 0.9 as part of https://github.com/ni/nimble/issues/1090
      }
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
};
