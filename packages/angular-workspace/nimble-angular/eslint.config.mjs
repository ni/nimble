import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig, angularTypescriptNimbleConfig, angularTemplateNimbleConfig } from '@ni-private/eslint-config-nimble';
import { resolve } from 'node:path';

export default defineConfig([
    globalIgnores([
        '**/dist/',
        '**/src/thirdparty/'
    ]),
    lintNimbleConfig,
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig,
        rules: {
            'import/no-extraneous-dependencies': ['error', { packageDir: resolve(import.meta.dirname, '../') }],
        }
    },
    {
        files: ['**/*.ts'],
        extends: angularTypescriptNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            'import/no-extraneous-dependencies': ['error', { packageDir: resolve(import.meta.dirname, '../') }],
        }
    },
    {
        files: ['**/build/**/*.js'],
        rules: {
            // Logging in build scripts is useful
            'no-console': 'off',
            // Rollup config files use default exports
            'import/no-default-export': 'off',
        },
    },
    {
        files: ['**/*.html'],
        extends: angularTemplateNimbleConfig
    }
]);
