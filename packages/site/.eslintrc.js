module.exports = {
    root: true,
    extends: [
        '@ni/eslint-config-javascript'
    ],
    ignorePatterns: [
        // Force inclusion of config dot file
        '!.eleventy.js',
        'node_modules',
        'dist'
    ],
};
