const path = require('path');
const baseConfigFunction = require('@ni-private/karma-config');
const webpackConfigFunction = require('@ni-private/karma-config/webpack');

const basePath = path.resolve(__dirname);

module.exports = config => {
    baseConfigFunction(config);
    webpackConfigFunction(config);

    config.set({
        basePath,
        frameworks: [...config.frameworks, 'jasmine-spec-tags'],
        plugins: [...config.plugins, 'karma-jasmine-spec-tags'],
        files: ['dist/esm/utilities/tests/setup.js'],
        preprocessors: {
            'dist/esm/utilities/tests/setup.js': ['webpack', 'sourcemap']
        }
    });
};
