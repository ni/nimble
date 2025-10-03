const { defineConfig } = require('eslint/config');
const { importNodeEsmConfig } = require('@ni/eslint-config-javascript');
const javascriptNimbleConfig = require('./javascript.js');

module.exports = defineConfig([
    {
        ignores: ['node_modules']
    },
    {
        files: ['**/*.js'],
        extends: [...javascriptNimbleConfig, ...importNodeEsmConfig]
    }
]);
