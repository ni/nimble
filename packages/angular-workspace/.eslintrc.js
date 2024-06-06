const { ignoreAttributes } = require('@ni/eslint-config-angular/template/options');

module.exports = {
    root: true,
    ignorePatterns: [
        '!**/*',
        'node_modules',
        'dist'
    ],
    overrides: [
        {
            files: ['*.js'],
            extends: ['@ni-private/eslint-config-nimble/javascript'],
            rules: {
                // Use package.json from angular-workspace root
                'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],
            }
        },
        {
            files: ['*.ts'],
            extends: [
                '@ni/eslint-config-angular',
                '@ni/eslint-config-angular/requiring-type-checking',
                '@ni-private/eslint-config-nimble/typescript'
            ],
            rules: {
                // Use package.json from angular-workspace root
                'import/no-extraneous-dependencies': ['error', { packageDir: __dirname }],
                'no-restricted-imports': ['error', {
                    patterns: [{
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

                // Rules enabled due to strictNullChecks
                // see: https://github.com/ni/javascript-styleguide/#strict-null-checks
                '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'error',
                '@typescript-eslint/no-unnecessary-condition': 'error',
                '@typescript-eslint/strict-boolean-expressions': ['error', {
                    allowNumber: false,
                    allowNullableBoolean: true,
                    allowNullableString: true,
                    allowNullableNumber: false
                }],

                // Nimble Angular Components follow web component naming conventions
                // where the attribute and property names are different formats
                '@angular-eslint/no-input-rename': 'off'
            }
        },
        {
            // Don't require class docs on modules (they're trivial)
            files: ['*.module.ts'],
            rules: {
                'jsdoc/require-jsdoc': 'off',
                'jsdoc/require-description': 'off'
            }
        },
        {
            files: ['*.spec.ts'],
            rules: {
                'no-restricted-imports': [
                    'error', {
                        patterns: [{
                            group: ['@microsoft/fast-*'],
                            message: 'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.'
                        }, {
                            group: ['@ni/nimble-components', '@ni/spright-components'],
                            message: 'Angular tests should not directly depend on web component packages.'
                        }]
                    }
                ],

                // Jasmine createSpyObj rely on accessing unbound methods
                '@typescript-eslint/unbound-method': 'off'
            }
        },
        {
            files: ['**/testing/**'],
            rules: {
                'no-restricted-imports': [
                    'error', {
                        patterns: [{
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
                // Enable i18n template checking for the purpose of making sure to capture updates for the lint rules
                '@angular-eslint/template/i18n': [
                    'error',
                    {
                        checkText: false,
                        checkId: false,
                        ignoreAttributes: [
                            // Attributes that SHOULD NOT ever be localized need to be added to ignoreAttributeSets
                            // See: https://github.com/ni/javascript-styleguide/blob/main/packages/eslint-config-angular/template/options.js
                            ...ignoreAttributes.all,

                            // Attributes that SHOULD be localized in production, but we don't want to
                            // for tests / examples apps should be added to the following list:
                            'action-menu-label',
                            'aria-label',
                            'button-label',
                            'label',
                            'placeholder',
                            'text',
                            'title'
                        ]
                    }
                ],
            }
        }
    ]
};
