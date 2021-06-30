module.exports = {
    extends: [
        '@ni/eslint-config/typescript',
        '@ni/eslint-config/typescript-requiring-type-checking'
    ],
    parserOptions: {
        project: './tsconfig.json'
    }
};