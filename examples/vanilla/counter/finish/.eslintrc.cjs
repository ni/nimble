module.exports = {
    extends: [
        '@ni/eslint-config-typescript',
        '@ni/eslint-config-typescript/requiring-type-checking'
    ],
    ignorePatterns: ['*.js', '*.cjs'],
    parserOptions: {
        project: ['./tsconfig.json'],
        tsconfigRootDir: __dirname
    },
    rules: {
        // Rules enabled due to strictNullChecks
        '@typescript-eslint/no-non-null-assertion': 'off',
    },
    root: true
};
