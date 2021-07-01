module.exports = {
  extends: '../../.eslintrc.js',
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
      rules: {}
    },
    {
      files: [
        '*.html'
      ],
      rules: {}
    }
  ]
};
