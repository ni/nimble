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
          'projects/ni/nimble-angular/tsconfig.lib.json',
          'projects/ni/nimble-angular/tsconfig.spec.json'
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
}
