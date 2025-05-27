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
            files: ['*.ts', '*.tsx'],
            extends: [
                '@ni-private/eslint-config-nimble/typescript',
                'plugin:react-hooks/recommended',
            ],
            plugins: [
                'react-hooks',
                'react-refresh'
            ],
            parserOptions: {
                project: 'tsconfig.app.json',
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
                'react-refresh/only-export-components': [
                    'error',
                    { allowConstantExport: true },
                ],
            }
        },
        {
            files: ['vite.config.ts'],
            parserOptions: {
                project: 'tsconfig.node.json',
                tsconfigRootDir: __dirname
            },
            rules: {
                // Configuration scripts will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
                'import/no-default-export': 'off',
            }
        },
    ],
};
