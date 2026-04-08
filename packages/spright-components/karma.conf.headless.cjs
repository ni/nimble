/**
 * A karma config file that sets up reporting for headless test runs
 */

const karmaSpecReporter = require('karma-spec-reporter');
const jasmineExtensions = require('@ni-private/jasmine-extensions');
const originalConfigFunction = require('./karma.conf.cjs');

module.exports = config => {
    originalConfigFunction(config);
    const options = {
        plugins: [jasmineExtensions, ...config.plugins, karmaSpecReporter],
        frameworks: ['jasmine-extensions', ...config.frameworks],
        reporters: ['spec'],
        specReporter: {
            suppressPassed: true,
            suppressSkipped: false,
            showSpecTiming: true
        }
    };

    config.set(options);
};
