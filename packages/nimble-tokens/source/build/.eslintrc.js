module.exports = {
    rules: {
        // Build scripts will not be in published package and are allowed to use devDependencies
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
    }
};