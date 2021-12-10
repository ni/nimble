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
                            group: ['@ni/nimble-components'],
                            message: 'Do not directly use nimble components library. Instead rely on or add to exports of nimble-angular.'
                        }]
                }]
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
