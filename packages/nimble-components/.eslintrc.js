module.exports = {
    root: true,
    extends: '@ni',
    parserOptions: {
        ecmaVersion: 2020
    },
    ignorePatterns: [
        '!/.storybook',
        'node_modules',
        'dist'
    ],
    overrides: [{
        files: ['.storybook/**'],
        env: {
            browser: true
        },
        rules: {
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            'import/no-default-export': 'off'
        }
    }]
};
