import { defineConfig } from 'eslint/config';
import { angularTypescriptConfig, angularTemplateConfig, ignoreAttributes } from '@ni/eslint-config-angular';
import { typescriptNimbleConfigOverrides } from './typescript.js';
import { javascriptNimbleConfigOverrides } from './javascript.js';

export const angularTypescriptNimbleConfigOverrides = defineConfig([
    {
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['@ni/fast-*'],
                            message:
                                'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.',
                        },
                        {
                            group: [
                                '@ni/*-components/**/tests',
                                '@ni/*-components/**/testing',
                            ],
                            message: 'Do not use test code/utilities in production code.',
                        },
                    ],
                },
            ],

            // Nimble Angular Components follow web component naming conventions
            // where the attribute and property names are different formats
            '@angular-eslint/no-input-rename': 'off',
        },
    },
    {
        // Don't require class docs on modules (they're trivial)
        files: ['**/*.module.ts'],
        rules: {
            'jsdoc/require-jsdoc': 'off',
            'jsdoc/require-description': 'off',
        },
    },
    {
        files: ['**/*.spec.ts'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['@ni/fast-*'],
                            message:
                                'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.',
                        },
                        {
                            group: ['@ni/nimble-components', '@ni/spright-components'],
                            message:
                                'Angular tests should not directly depend on web component packages.',
                        },
                    ],
                },
            ],
            // Jasmine createSpyObj rely on accessing unbound methods
            '@typescript-eslint/unbound-method': 'off',
        },
    },
    {
        files: ['**/testing/**'],
        rules: {
            'no-restricted-imports': [
                'error',
                {
                    patterns: [
                        {
                            group: ['@ni/fast-*'],
                            message:
                                'Do not directly use underlying libraries of nimble. Instead rely on or add to exports of nimble packages.',
                        },
                    ],
                },
            ],
        },
    },
]);

export const angularTypescriptNimbleConfig = defineConfig([
    {
        extends: [
            angularTypescriptConfig,
            javascriptNimbleConfigOverrides,
            typescriptNimbleConfigOverrides,
            angularTypescriptNimbleConfigOverrides,
        ],
    }
]);

export const angularTemplateNimbleConfigOverrides = defineConfig([
    {
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
                        // in example apps should be added to the following list:
                        'action-menu-label',
                        'aria-label',
                        'button-label',
                        'label',
                        'placeholder',
                        'text',
                        'title',
                    ],
                },
            ],
        }
    },
    {
        // Ignore inline templates in tests using the inline template naming convention
        // See naming details: https://github.com/angular-eslint/angular-eslint/releases/tag/v14.0.0
        files: ['**/*.spec.ts*.html'],
        rules: {
            /*
                Tests often define helper components that don't need to be marked for i18n.
            */
            '@angular-eslint/template/i18n': 'off'
        }
    }
]);

export const angularTemplateNimbleConfig = defineConfig([
    {
        extends: [
            angularTemplateConfig,
            angularTemplateNimbleConfigOverrides
        ],
    },
]);
