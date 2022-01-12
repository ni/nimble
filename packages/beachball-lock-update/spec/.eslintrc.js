module.exports = {
    env: {
        node: true,
        jasmine: true
    },
    rules: {
        // Node mjs files do not support directory imports or extension-les imports
        'import/no-useless-path-segments': 'off',
        'import/extensions': ['error', 'always', { ignorePackages: true }]
    }
};
