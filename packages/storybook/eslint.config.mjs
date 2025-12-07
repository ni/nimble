import { defineConfig, globalIgnores } from 'eslint/config';
import { importNodeEsmConfig } from '@ni/eslint-config-javascript';
import { lintNimbleConfig, componentsNimbleConfig, javascriptNimbleConfig } from '@ni-private/eslint-config-nimble';
import globals from 'globals';
import storybook from 'eslint-plugin-storybook';

export default defineConfig([
    globalIgnores([
        '**/dist/',
        '**/.storybook/blocks/StoryLayout.tsx',
    ]),
    lintNimbleConfig,
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig,
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: [
            componentsNimbleConfig,
            storybook.configs['flat/recommended']
        ],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsConfigRootDir: import.meta.dirname
            }
        },
        rules: {
            // Storybook tends to rely on default exports in plugins
            'import/no-default-export': 'off',

            // Storybook is not a published package and is allowed to use devDependencies
            'import/no-extraneous-dependencies': [
                'error',
                { devDependencies: true }
            ],

            // Disables a rule from storybook recommended we have not followed
            // No reason we couldn't other than low ROI
            'storybook/prefer-pascal-case': 'off',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off',
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off'
        }
    },
    {
        files: ['**/build/**/*.js'],
        rules: {
            // Build scripts should give verbose logging
            'no-console': 'off'
        }
    },
    {
        files: ['**/.storybook/**/*.js'],
        extends: importNodeEsmConfig,
        languageOptions: {
            globals: {
                ...globals.browser
            }
        },
        rules: {
            // Storybook tends to rely on default exports in plugins
            'import/no-default-export': 'off',

            // Storybook is not a published package and is allowed to use devDependencies
            'import/no-extraneous-dependencies': [
                'error',
                { devDependencies: true }
            ]
        }
    },
]);
