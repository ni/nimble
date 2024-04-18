const path = require('path');
const baseConfigFunction = require('@ni-private/karma-config');

const basePath = path.resolve(__dirname);

module.exports = (config, verbose = false) => {
    baseConfigFunction(config, true, verbose);

    config.set({
        basePath,
        files: ['dist/esm/utilities/tests/setup.js'],
        preprocessors: {
            'dist/esm/utilities/tests/setup.js': ['webpack', 'sourcemap']
        }
    });
};
