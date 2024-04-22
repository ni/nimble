const path = require('path');

module.exports = {
    extends: '../../../.eslintrc.js',
    ignorePatterns: [
        '!**/*',
        '**/dist'
    ],
    plugins: ['jsdoc'],
    overrides: [
        {
            files: [
                '*.ts'
            ],
            parserOptions: {
                project: [
                    './tsconfig.lib.json',
                    './tsconfig.spec.json'
                ],
                tsconfigRootDir: __dirname,
                createDefaultProgram: true
            },
            rules: {
                // Require non-empty JSDoc comment on classes
                'jsdoc/require-jsdoc': [
                    'error',
                    {
                        publicOnly: false,
                        require: {
                            ClassDeclaration: true,
                            FunctionDeclaration: false
                        }
                    }
                ],
                'jsdoc/require-description': [
                    'error',
                    { contexts: ['ClassDeclaration'] }
                ],
            }
        },
        {
            files: [
                '*.js',
                '*.ts'
            ],
            rules: {
                // Use package.json from angular-workspace root
                'import/no-extraneous-dependencies': ['error', { packageDir: path.resolve(__dirname, '../../../') }],
                // Spright Angular Components follow web component naming conventions
                // where the attribute and property names are different formats
                '@angular-eslint/no-input-rename': 'off'
            }
        },
        {
            // Don't require class docs on modules (they're trivial) or tests (not public API)
            files: [
                '*.module.ts', '*.spec.ts'
            ],
            rules: {
                'jsdoc/require-jsdoc': 'off',
                'jsdoc/require-description': 'off'
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
