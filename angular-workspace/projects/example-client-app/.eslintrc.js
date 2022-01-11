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
      rules: {
        'no-restricted-imports': ['error', {
          patterns:
          [{
              group: ['@microsoft/fast-*'],
              message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
          }, {
              group: ['@ni/nimble-components'],
              message: 'Client Angular applications should not have to directly depend on nimble-components.'
          }]
      }],
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
