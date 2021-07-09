module.exports = {
    rules: {
        // Build scripts allowed to use devDependencies
        'import/no-extraneous-dependencies': ['error', { devDependencies: true }]
    }
};