module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist',
        // Force inclusion of config dot file
        '!.eleventy.js',
    ],
    overrides: [
        {
            files: ['*.js'],
            extends: ['@ni-private/eslint-config-nimble/javascript'],
        },
        {
            files: ['*.ts'],
            extends: ['@ni-private/eslint-config-nimble/typescript'],
            parserOptions: {
                project: ['./tsconfig.json'],
                tsconfigRootDir: __dirname
            },
        }
    ]
};
