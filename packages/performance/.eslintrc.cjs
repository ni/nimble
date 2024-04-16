module.exports = {
    root: true,
    extends: 'plugin:nimble/javascript',
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
    }, {
        files: ['vite.config.js'],
        rules: {
            // Configuration scripts will not be in published package and are allowed to use devDependencies
            'import/no-extraneous-dependencies': ['error', { devDependencies: true }],
        }
    }]
};
