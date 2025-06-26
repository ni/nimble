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
            files: ['build/**/*.js'],
            rules: {
                // Build scripts should give verbose logging
                'no-console': 'off',
                // Rollup config files use default exports
                'import/no-default-export': 'off',
            },
        },
        {
            files: ['*.ts'],
            extends: ['@ni-private/eslint-config-nimble/typescript'],
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname
            },
            rules: {
                // The React components should use PascalCase
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'variable',
                        format: ['camelCase', 'PascalCase']
                    },
                ],
            }
        }
    ],
};
