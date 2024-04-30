/**
 * A karma config file that adds verbose reporting to the base configuration
 */

const originalConfigFunction = require('./karma.conf');

module.exports = config => {
    originalConfigFunction(config);
    const options = {
        plugins: [...config.plugins, 'karma-spec-reporter'],
        reporters: [...config.reporters, 'spec'],
        specReporter: {
            suppressPassed: true,
            suppressSkipped: false,
            showSpecTiming: true
        }
    };

    config.set(options);
};
