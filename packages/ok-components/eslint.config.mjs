import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, componentsNimbleConfig, javascriptNimbleConfig } from '@ni-private/eslint-config-nimble';

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
        extends: componentsNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname
            }
        }
    }
]);
