module.exports = {
  extends: '../../.eslintrc.js',
  rules: {
    "import/no-extraneous-dependencies": ["error", {"packageDir": require('path').join(__dirname, '../../')}]
  },
  ignorePatterns: [
    '!**/*'
  ],
  overrides: [
    {
      files: [
        '*.ts'
      ],
      parserOptions: {
        project: [
          'projects/example-client-app/tsconfig.app.json',
          'projects/example-client-app/tsconfig.spec.json'
        ],
        createDefaultProgram: true
      },
      rules: {
      }
    },
    {
      files: [
        '*.html'
      ],
      rules: {}
    }
  ]
};
