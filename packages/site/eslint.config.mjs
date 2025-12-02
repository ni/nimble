import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig, typescriptNimbleConfig} from '@ni-private/eslint-config-nimble';

export default defineConfig([
    {
        ignores: [
            '**/dist/**',
            // Force inclusion of config dot file
            '!**/*.eleventy.js',
        ],
    },
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig,
    },
    {
        files: ['**/*.ts'],
        extends: typescriptNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
]);
