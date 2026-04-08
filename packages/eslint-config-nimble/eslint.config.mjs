import { defineConfig } from 'eslint/config';
import { importNodeEsmConfig, javascriptConfig } from '@ni/eslint-config-javascript';
import { lintNimbleConfig } from './lint.js';

export default defineConfig([
    lintNimbleConfig,
    {
        files: ['**/*.js'],
        extends: [javascriptConfig, importNodeEsmConfig]
    },
]);
