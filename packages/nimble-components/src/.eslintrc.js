module.exports = {
    root: true,
    extends: 'plugin:@ni-private/nimble/typescript',
    parserOptions: {
        project: '../tsconfig.json',
        tsconfigRootDir: __dirname
    }
};
