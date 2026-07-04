import { defineConfig, globalIgnores } from 'eslint/config';
import { importNodeEsmConfig } from '@ni/eslint-config-javascript';
import { lintNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    globalIgnores(['**/dist/']),
    lintNimbleConfig,
    {
        files: ['**/*.mjs'],
        extends: importNodeEsmConfig
    }
]);
