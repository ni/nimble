// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('playwright').chromium.executablePath();
const karmaJasmine = require('karma-jasmine');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaJasmineHtmlReporter = require('karma-jasmine-html-reporter');
const karmaSpecReporter = require('karma-spec-reporter');
const karmaCoverage = require('karma-coverage');
const karmaAngular = require('@angular-devkit/build-angular/plugins/karma');
const path = require('path');

module.exports = config => {
    config.set({
        basePath: '',
        frameworks: ['jasmine', '@angular-devkit/build-angular'],
        plugins: [
            karmaJasmine,
            karmaChromeLauncher,
            karmaJasmineHtmlReporter,
            karmaSpecReporter,
            karmaCoverage,
            karmaAngular
        ],
        client: {
            jasmine: {
                failSpecWithNoExpectations: true,
                stopSpecOnExpectationFailure: false
            },
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },
        coverageReporter: {
            dir: path.join(__dirname, '../coverage/nimble-angular'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
        reporters: ['kjhtml', 'spec'],
        specReporter: {
            suppressPassed: true,
            suppressSkipped: false,
            showSpecTiming: true
        },
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: false,
        restartOnFileChange: true,
        customHeaders: [
            // Test under the OWASP Basic non-strict CSP Policy
            // See: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html#basic-non-strict-csp-policy
            // Need script-src 'unsafe-inline' to support karma behavior
            // See https://github.com/karma-runner/karma/issues/3260
            // Need script-src 'unsafe-eval' to support running in Angular tests
            // Need style-src 'unsafe-inline' to support FAST
            // See: https://github.com/microsoft/fast/issues/4510
            // Need worker-src blob: to support current worker loading pattern
            {
                match: '\\.html',
                name: 'Content-Security-Policy',
                value: "default-src 'self'; frame-ancestors 'self'; form-action 'self'; object-src 'none'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; worker-src 'self' blob: ;"
            }
        ]
    });
};
