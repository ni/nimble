import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig } from '@ni-private/eslint-config-nimble';

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
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        extends: javascriptNimbleConfig,
        rules: {
            'import/extensions': 'off'
        }
    },
    {
        files: ['**/build/**/*.js', '**/build/**/*.cjs', '**/build/**/*.mjs'],
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
    }
]);
