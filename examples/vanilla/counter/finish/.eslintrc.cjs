module.exports = {
    extends: [
        '@ni/eslint-config-typescript',
        '@ni/eslint-config-typescript/requiring-type-checking'
    ],
    ignorePatterns: ['*.js', '*.cjs'],
    parserOptions: {
        project: ['./tsconfig.json'],
        // Resolve the project relative to this file's directory.
        // https://stackoverflow.com/questions/64933543/parsing-error-cannot-read-file-tsconfig-json-eslint
        tsconfigRootDir: __dirname
    },
    rules: {
        // Rules enabled due to strictNullChecks
        '@typescript-eslint/no-non-null-assertion': 'off',
    },
    root: true
};
