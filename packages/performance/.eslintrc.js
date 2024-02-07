module.exports = {
    root: true,
    extends: [
        '@ni/eslint-config-javascript'
    ],
    ignorePatterns: [
        // Force inclusion of config dot file
        '!.eslintrc.js',
        'node_modules',
        'dist'
    ],
    rules: {
        // Enabled to prevent accidental usage of async-await
        'require-await': 'error'
    },
    overrides: [{
        files: ['*.ts'],
        extends: [
            '@ni/eslint-config-typescript',
            '@ni/eslint-config-typescript/requiring-type-checking'
        ],
        parserOptions: {
            project: './tsconfig.json',
            tsconfigRootDir: __dirname
        },
        rules: {
            // Rules enabled due to strictNullChecks
            '@typescript-eslint/no-non-null-assertion': 'off',
        }
    }]
};
