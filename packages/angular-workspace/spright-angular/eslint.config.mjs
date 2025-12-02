import { defineConfig } from 'eslint/config';
import baseConfig from '../eslint.config.mjs';

export default defineConfig([
    baseConfig,
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
    },
]);
