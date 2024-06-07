module.exports = {
    extends: '@ni/eslint-config-javascript',
    parserOptions: {
        ecmaVersion: 2020
    },
    rules: {
        // Enabled to prevent accidental usage of async-await
        'require-await': 'error',
        'no-return-await': 'off'
    },
};
