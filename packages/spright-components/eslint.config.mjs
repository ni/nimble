import { defineConfig } from 'eslint/config';
import { javascriptNimbleConfig, componentsNimbleConfig} from '@ni-private/eslint-config-nimble';

export default defineConfig([
    {
        ignores: ['**/dist/**']
    },
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig
    },
    {
        files: ['**/*.ts'],
        extends: componentsNimbleConfig,
        languageOptions: {
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: import.meta.dirname
            }
        },
        rules: {
            // Disable strict null checks
            '@typescript-eslint/no-unnecessary-condition': 'off',
            '@typescript-eslint/strict-boolean-expressions': 'off',
            '@typescript-eslint/no-unnecessary-boolean-literal-compare': 'off'
        }
    }
]);
