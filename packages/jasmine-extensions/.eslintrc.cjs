module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist'
    ],
    overrides: [
        {
            files: ['*.js', '*.cjs'],
            extends: ['@ni-private/eslint-config-nimble/javascript'],
            rules: {
                // Configuration scripts will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            }
        },
        {
            files: ['*.ts'],
            extends: ['@ni-private/eslint-config-nimble/typescript'],
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname
            }
        }
    ],
};
