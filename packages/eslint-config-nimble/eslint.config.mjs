import { defineConfig } from 'eslint/config';
import { lintNimbleConfig } from './lint.js';

export default defineConfig([
    {
        files: ['**/*.js'],
        extends: [lintNimbleConfig]
    },
]);
