import { javascriptNimbleConfig } from '@ni-private/eslint-config-nimble/javascript';
import { defineConfig } from 'eslint/config';
import globals from 'globals';

export default defineConfig([
    {
        ignores: [
            'node_modules',
            '**/dist/**',
            '**/bin/**',
            '**/obj/**',
            '**/wwwroot/**',
            '!**/wwwroot/*.lib.module.js',
        ],
    },
    {
        files: ['**/*.js'],
        extends: [...javascriptNimbleConfig],
    },
    {
        files: ['**/build/**/*.js'],
        rules: {
            // Build scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],

            // Okay to use console.log in build scripts
            'no-console': 'off',

            // Rollup config files use default exports
            'import/no-default-export': 'off',

            // Allow build to reference files in NimbleBlazor and SprightBlazor
            'import/no-relative-packages': 'off',
        },
    },
    {
        files: ['**/build/generate-hybrid/source/*.js'],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
    },
    {
        files: ['eslint.config.js'],
        rules: {
            'import/no-default-export': 'off',
            // eslint-plugin-import doesn't know how to resolve entry points in packages
            // that use modern export maps in package.json.
            // https://github.com/typescript-eslint/typescript-eslint/issues/7565
            // https://github.com/import-js/eslint-plugin-import/issues/2703
            'import/no-unresolved': [
                'error',
                {
                    ignore: ['eslint/config'],
                },
            ],
        },
    },
]);
