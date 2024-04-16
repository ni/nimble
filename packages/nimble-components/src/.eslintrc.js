module.exports = {
    root: true,
    extends: 'plugin:nimble/typescript',
    parserOptions: {
        project: '../tsconfig.json',
        tsconfigRootDir: __dirname
    }
};
