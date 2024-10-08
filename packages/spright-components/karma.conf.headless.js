/**
 * A karma config file that sets up reporting for headless test runs
 */

const originalConfigFunction = require('./karma.conf');

module.exports = config => {
    originalConfigFunction(config);
    const options = {
        plugins: [...config.plugins, 'karma-spec-reporter'],
        reporters: ['spec'],
        specReporter: {
            suppressPassed: true,
            suppressSkipped: false,
            showSpecTiming: true
        }
    };

    config.set(options);
};
