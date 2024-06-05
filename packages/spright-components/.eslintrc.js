module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist'
    ],
    overrides: [
        {
            extends: ['@ni-private/eslint-config-nimble/javascript'],
            files: ['*.js']
        },
        {
            extends: ['@ni-private/eslint-config-nimble/components'],
            files: ['*.ts'],
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname
            },
        }
    ]
};
