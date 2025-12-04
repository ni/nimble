import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig } from '@ni-private/eslint-config-nimble';
import globals from 'globals';

export default defineConfig([
    globalIgnores([
        '**/dist/',
        '**/bin/',
        '**/obj/',
        '**/wwwroot/',
        '!**/wwwroot/*.lib.module.js',
    ]),
    lintNimbleConfig,
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig,
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
]);
