import { defineConfig, globalIgnores } from 'eslint/config';
import { lintNimbleConfig, javascriptNimbleConfig } from '@ni-private/eslint-config-nimble';

export default defineConfig([
    globalIgnores(['**/packages/']),
    lintNimbleConfig,
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig
    }
]);
