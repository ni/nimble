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
            extends: ['@ni-private/eslint-config-nimble/typescript'],
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname
            },
            rules: {
                // This is a command line app so printing to console to show progress is desirable
                'no-console': 'off',
            },
        }
    ]
};
