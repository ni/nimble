const baseConfigFunction = require('@ni-private/karma-config');
const path = require('path');

const basePath = path.resolve(__dirname);

module.exports = config => {
    baseConfigFunction(config);

    config.set({
        basePath,
        files: [
            // Test files
            { pattern: './dist/esm/**/*.spec.js', type: 'module' },
            // Library files and dependencies
            { pattern: './dist/esm/**/*.js', type: 'module', included: false },
            { pattern: './dist/esm/**/*.map', included: false },
        ]
    });
};
