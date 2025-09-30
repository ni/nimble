import { defineConfig } from 'eslint/config';
// eslint-disable-next-line import/extensions
import { javascriptNimbleConfig } from './javascript.js';

export default defineConfig([
    {
        ignores: ['node_modules'],
    },
    {
        files: ['**/*.js'],
        extends: [javascriptNimbleConfig],
    }
]);
