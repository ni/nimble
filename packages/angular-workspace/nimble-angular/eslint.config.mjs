import { defineConfig } from 'eslint/config';
import baseConfig from '../eslint.config.mjs';

export default defineConfig([
    baseConfig,
    {
        ignores: ['**/src/thirdparty'],
    },
    {
        files: ['**/*.ts'],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.lib.json', './tsconfig.spec.json'],
                tsconfigRootDir: import.meta.dirname,
            },
        },
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
]);
