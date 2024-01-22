module.exports = {
    root: true,
    overrides: [
        {
            files: ['**/*.ts'],
            extends: [
                '@ni/eslint-config-typescript',
                '@ni/eslint-config-typescript/requiring-type-checking'
            ],
            parserOptions: {
                project: 'tsconfig.json',
                tsconfigRootDir: __dirname
            },
            rules: {
                // Rules enabled due to strictNullChecks
                '@typescript-eslint/no-non-null-assertion': 'off',
            }
        },
        {
            files: ['*.spec.ts'],
            env: {
                jasmine: true
            },
            rules: {
                // Classes defined in test code aren't part of the public API so don't need docs
                'jsdoc/require-jsdoc': 'off',
                'jsdoc/require-description': 'off',
            }
        },
        {
            files: ['*.js', '*.cjs'],
            extends: [
                '@ni/eslint-config-javascript'
            ],
            rules: {
                // Configuration scripts will not be in published package and are allowed to use devDependencies
                'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
            }
        }
    ],
    ignorePatterns: ['dist', 'node_modules']
};
