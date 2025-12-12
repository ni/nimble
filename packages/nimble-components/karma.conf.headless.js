/**
 * A karma config file that sets up reporting for headless test runs
 */

// eslint-disable-next-line import/no-extraneous-dependencies
const karmaSpecReporter = require('karma-spec-reporter');
const originalConfigFunction = require('./karma.conf');

module.exports = config => {
    originalConfigFunction(config);
    const options = {
        plugins: [...config.plugins, karmaSpecReporter],
        reporters: ['spec'],
        specReporter: {
            suppressPassed: true,
            suppressSkipped: false,
            showSpecTiming: true
        }
    };

    config.set(options);
};
