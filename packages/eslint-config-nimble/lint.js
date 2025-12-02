import { defineConfig } from 'eslint/config';
import { javascriptConfig, importNodeEsmConfig } from '@ni/eslint-config-javascript';

export const lintNimbleConfig = defineConfig([
    javascriptConfig, importNodeEsmConfig
]);
