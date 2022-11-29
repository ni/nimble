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
    rules: {
        // Enabled to prevent accidental usage of async-await
        'require-await': 'error'
    }
};
