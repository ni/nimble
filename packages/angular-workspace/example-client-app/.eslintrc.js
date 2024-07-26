module.exports = {
    extends: '../.eslintrc.js',
    ignorePatterns: ['/src/environments'],
    overrides: [
        {
            files: ['*.ts'],
            parserOptions: {
                project: [
                    './tsconfig.app.json',
                    './tsconfig.spec.json'
                ],
                tsconfigRootDir: __dirname
            },
            rules: {
                'no-restricted-imports': ['error', {
                    patterns:
                [{
                    group: ['@microsoft/fast-*'],
                    message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
                },
                {
                    group: ['@ni/nimble-components', '@ni/spright-components'],
                    message: 'Client Angular applications should not directly depend on web component packages.'
                }]
                }],
                '@angular-eslint/component-selector': [
                    'error',
                    { type: 'element', prefix: 'example', style: 'kebab-case' }
                ],
                'jsdoc/require-jsdoc': 'off',
                'jsdoc/require-description': 'off'
            }
        }
    ]
};
