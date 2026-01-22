import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig, typescriptNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    globalIgnores(['**/dist/']),
    lintNimbleConfig,
    {
        files: ['**/*.js', '**/*.cjs', '**/*.mjs'],
        extends: [javascriptNimbleConfig],
        rules: {
            'import/extensions': 'off'
        }
    },
    {
        files: ['**/*.ts'],
        extends: typescriptNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname,
            },
        },
        rules: {
            // This is a command line app so printing to console to show progress is desirable
            'no-console': 'off',
        },
    }
]);
