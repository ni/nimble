// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('playwright').chromium.executablePath();
const karmaJasmine = require('karma-jasmine');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaJasmineHtmlReporter = require('karma-jasmine-html-reporter');
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
            karmaCoverage,
            karmaAngular
        ],
        client: {
            jasmine: {
                // you can add configuration options for Jasmine here
                // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
                // for example, you can disable the random execution with `random: false`
                // or set a specific seed with `seed: 4321`
                stopSpecOnExpectationFailure: false
            },
            clearContext: false // leave Jasmine Spec Runner output visible in browser
        },
        jasmineHtmlReporter: {
            suppressAll: true // removes the duplicated traces
        },
        coverageReporter: {
            dir: path.join(__dirname, '../../../coverage/ni/nimble-angular'),
            subdir: '.',
            reporters: [
                { type: 'html' },
                { type: 'text-summary' }
            ]
        },
        reporters: ['progress', 'kjhtml'],
        port: 9876,
        colors: true,
        logLevel: config.LOG_INFO,
        autoWatch: true,
        browsers: ['ChromeHeadless'],
        singleRun: false,
        restartOnFileChange: true,
        customHeaders: [
            // Add a Content-Security-Policy header for the tests
            // Following: https://developer.chrome.com/docs/extensions/reference/manifest/content-security-policy
            // Need script-src 'unsafe-inline' to support karma behavior
            // See https://github.com/karma-runner/karma/issues/3260
            // Need worker-src blob: to support current worker loading pattern
            {
                match: '\\.html',
                name: 'Content-Security-Policy',
                value: "script-src 'self' 'unsafe-inline'; object-src 'self'; worker-src 'self' blob: ;"
            }
        ]
    });
};
