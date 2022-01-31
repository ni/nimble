module.exports = {
    root: true,
    extends: [
        '@ni/eslint-config-javascript'
    ],
    rules: {
        // Build scripts should give verbose logging
        'no-console': 'off',
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
};
