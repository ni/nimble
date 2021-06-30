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
      rules: {
        '@angular-eslint/directive-selector': [
          'error',
          {
            type: 'attribute',
            prefix: 'app',
            style: 'camelCase'
          }
        ],
        '@angular-eslint/component-selector': [
          'error',
          {
            type: 'element',
            prefix: 'app',
            style: 'kebab-case'
          }
        ]
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
