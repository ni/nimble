module.exports = {
    root: true,
    overrides: [{
        files: ['*.ts'],
        extends: [
            '@ni/eslint-config-angular',
            '@ni/eslint-config-typescript/requiring-type-checking'
        ],
        rules: {
            'no-restricted-imports': ['error', {
                patterns:
                [{
                    group: ['@microsoft/fast-*'],
                    message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
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
            }]
        }
    }, {
        files: ['*.spec.ts'],
        extends: [
            '@ni/eslint-config-angular',
            '@ni/eslint-config-typescript/requiring-type-checking'
        ],
        rules: {
            'no-restricted-imports': [
                'error', {
                    patterns:
                    [{
                        group: ['@microsoft/fast-*'],
                        message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
                    }, {
                        group: ['@ni/nimble-components'],
                        message: 'Client Angular applications should not have to directly depend on nimble-components.'
                    }]
                }
            ],

            // Recommended rules with strict null checks enabled: https://github.com/ni/javascript-styleguide/#strict-null-checks
            '@typescript-eslint/no-non-null-assertion': 'off',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
            '@typescript-eslint/no-unnecessary-condition': 'error',
            '@typescript-eslint/strict-boolean-expressions': ['error', {
                allowNumber: false,
                allowNullableBoolean: true,
                allowNullableString: true,
                allowNullableNumber: false
            }]
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
    }]
};