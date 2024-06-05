module.exports = {
    root: true,
    extends: '@ni-private/eslint-config-nimble/typescript',
    parserOptions: {
        project: '../tsconfig.json',
        tsconfigRootDir: __dirname
    },
    ignorePatterns: [
        '.eslintrc.js', // Avoids eslint error: https://typescript-eslint.io/linting/troubleshooting#i-get-errors-telling-me-eslint-was-configured-to-run--however-that-tsconfig-does-not--none-of-those-tsconfigs-include-this-file
        'wafer-map/workers/'
    ] 
};
