module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
    ],
    overrides: [
        {
            files: ['*.js'],
            extends: ['@ni-private/eslint-config-nimble/javascript'],
        },
    ]
};
