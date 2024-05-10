module.exports = {
    root: true,
    ignorePatterns: [
        '!**/*',
        '**/dist'
    ],
    plugins: ['jsdoc'],
    overrides: [{
        files: ['*.ts'],
        extends: [
            '@ni/eslint-config-angular',
            '@ni/eslint-config-angular/requiring-type-checking'
        ],
        rules: {
            'no-restricted-imports': ['error', {
                patterns:
                [{
                    group: ['@microsoft/fast-*'],
                    message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
                },
                {
                    group: [
                        '@ni/nimble-components/**/tests',
                        '@ni/nimble-components/**/testing',
                        '@ni/spright-components/**/tests',
                        '@ni/spright-components/**/testing'
                    ],
                    message: 'Do not use test code/utilities in production code.'
                }]
            }],

            // Recommended rules with strict null checks enabled: https://github.com/ni/javascript-styleguide/#strict-null-checks
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'error',
            '@typescript-eslint/strict-boolean-expressions': ['error', {
                allowNumber: false,
                allowNullableBoolean: true,
                allowNullableString: true,
                allowNullableNumber: false
            }],

            // Enabled to prevent accidental usage of async-await
            '@typescript-eslint/require-await': 'error',

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
            ]
        }
    }, {
        // Don't require class docs on modules (they're trivial) or tests (not public API)
        files: [
            '*.module.ts', '*.spec.ts'
        ],
        rules: {
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-description': 'off'
        }
    }, {
        files: ['*.spec.ts'],
        rules: {
            'no-restricted-imports': [
                'error', {
                    patterns:
                    [{
                        group: ['@microsoft/fast-*'],
                        message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
                    }, {
                        group: ['@ni/nimble-components', '@ni/spright-components'],
                        message: 'Angular tests should not directly depend on web component packages.'
                    }]
                }
            ]
        }
    }, {
        files: ['**/testing/**'],
        rules: {
            'no-restricted-imports': [
                'error', {
                    patterns:
                    [{
                        group: ['@microsoft/fast-*'],
                        message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
                    }]
                }
            ]
        }
    },
    {
        files: ['*.html'],
        extends: [
            '@ni/eslint-config-angular/template'
        ],
        rules: {
            // nimble-angular shouldn't provide user-visible strings so doesn't need i18n
            // example-client-app is just for demo purposes and isn't anticipated to be localized
            '@angular-eslint/template/i18n': 'off'
        }
    }, {
        files: ['*.js'],
        extends: [
            '@ni/eslint-config-javascript'
        ],
        rules: {
            // Enabled to prevent accidental usage of async-await
            'require-await': 'error'
        }
    }, {
        files: [
            '*.js',
            '*.ts'
        ],
        rules: {
            // Use package.json from angular-workspace root
            'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],
            // Nimble Angular Components follow web component naming conventions
            // where the attribute and property names are different formats
            '@angular-eslint/no-input-rename': 'off'
        }
    }]
};
