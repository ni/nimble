import { defineConfig } from 'eslint/config';
import { javascriptConfig } from '@ni/eslint-config-javascript';

export const javascriptNimbleConfigOverrides = defineConfig([]);

export const javascriptNimbleConfig = defineConfig([
    javascriptConfig,
    javascriptNimbleConfigOverrides
]);
