// eslint-disable-next-line import/no-extraneous-dependencies
const { defineConfig } = require('eslint/config');
const javascriptNimbleConfig = require('@ni-private/eslint-config-nimble/javascript');
const componentsNimbleConfig = require('@ni-private/eslint-config-nimble/components');
const globals = require('globals');
const storybook = require('eslint-plugin-storybook');

module.exports = defineConfig([
    {
        ignores: [
            'node_modules',
            '**/dist/**',
            // Force inclusion of storybook dot file hidden folder
            '!**/.storybook',
            '**/.storybook/blocks/StoryLayout.tsx',
            '**/src/nimble/icons'
        ]
    },
    {
        settings: {
            // Configure the `eslint-import-resolver-typescript` package to resolve `import/no-unresolved` eslint errors in JS files
            // Per https://iifx.dev/en/articles/322441446
            'import/resolver': {
                typescript: {} // this loads <rootdir>/tsconfig.json to eslint
            }
        }
    },
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig,
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
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: [
            ...componentsNimbleConfig,
            ...storybook.configs['flat/recommended']
        ],
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsConfigRootDir: __dirname
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
        files: ['**/.storybook/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser
            }
        }
    }
]);
