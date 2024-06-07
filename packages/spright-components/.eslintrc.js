module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist'
    ],
    overrides: [
        {
            files: ['*.js'],
            extends: ['@ni-private/eslint-config-nimble/javascript']
        },
        {
            files: ['*.ts'],
            extends: ['@ni-private/eslint-config-nimble/components'],
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname
            },
        }
    ]
};
