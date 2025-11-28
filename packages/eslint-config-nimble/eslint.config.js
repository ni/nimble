const { defineConfig } = require('eslint/config');
const javascriptNimbleConfig = require('./javascript.js');

module.exports = defineConfig([
    {
        files: ['**/*.js'],
        extends: javascriptNimbleConfig,
        rules: {
            'import/no-unresolved': 'off'
        }
    },
]);
