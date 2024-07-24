module.exports = {
    root: true,
    ignorePatterns: [
        'node_modules',
        'dist',
        'src/nimble/icons'
    ],
    overrides: [
        {
            files: ['*.js'],
            extends: ['@ni-private/eslint-config-nimble/javascript'],
        },
        {
            files: ['*.ts', '*.tsx'],
            extends: [
                '@ni-private/eslint-config-nimble/components'
            ],
            parserOptions: {
                project: './tsconfig.json',
                tsconfigRootDir: __dirname
            }
        },
        {
            files: ['**/*.react.tsx'],
            rules: {
                // The React components should use PascalCase
                '@typescript-eslint/naming-convention': [
                    'error',
                    {
                        selector: 'objectLiteralProperty',
                        format: ['PascalCase']
                    }
                ]
            }
        },
        {
            files: ['build/**/*.js'],
            rules: {
                // Build scripts should give verbose logging
                'no-console': 'off',
            },
        }
    ]
};
