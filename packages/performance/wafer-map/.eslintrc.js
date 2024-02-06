module.exports = {
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
