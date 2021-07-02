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
          './tsconfig.app.json',
          './tsconfig.spec.json'
        ],
        tsconfigRootDir: __dirname,
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
