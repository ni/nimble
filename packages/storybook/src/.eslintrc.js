module.exports = {
    root: true,
    extends: '@ni-private/eslint-config-nimble/typescript',
    parserOptions: {
        project: '../tsconfig.json',
        tsconfigRootDir: __dirname
    }
};
