module.exports = {
    root: true,
    extends: [
        '@ni/eslint-config-javascript'
    ],
    ignorePatterns: [
        'dist'
    ],
    rules: {
        // Build scripts should give verbose logging
        'no-console': 'off',
        // Rollup config files use default exports
        'import/no-default-export': 'off'
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
    },
};
