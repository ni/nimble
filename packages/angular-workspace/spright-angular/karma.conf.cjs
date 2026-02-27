// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

process.env.CHROME_BIN = require('playwright').chromium.executablePath();
const karmaJasmine = require('karma-jasmine');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaJasmineHtmlReporter = require('karma-jasmine-html-reporter');
const karmaSpecReporter = require('karma-spec-reporter');
const karmaCoverage = require('karma-coverage');
const jasmineExtensions = require('@ni-private/jasmine-extensions');
const path = require('path');

const commonChromeFlags = [
    '--no-default-browser-check',
    '--no-first-run',
    '--no-sandbox',
    '--no-managed-user-acknowledgment-check',
    '--disable-background-timer-throttling',
    '--disable-backing-store-limit',
    '--disable-boot-animation',
    '--disable-cloud-import',
    '--disable-contextual-search',
    '--disable-default-apps',
    '--disable-extensions',
    '--disable-infobars',
    '--disable-translate',
    '--force-prefers-reduced-motion',
    '--lang=en-US'
];

module.exports = config => {
    config.set({
        basePath: '',
        frameworks: [
            'jasmine-extensions',
            'jasmine'
        ],
        plugins: [
            jasmineExtensions,
            karmaJasmine,
            karmaChromeLauncher,
            karmaJasmineHtmlReporter,
            karmaSpecReporter,
            karmaCoverage,
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
            dir: path.join(__dirname, '../coverage/spright-angular'),
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
        browsers: ['ChromeHeadlessOpt'],
        customLaunchers: {
            ChromeDebugging: {
                base: 'Chrome',
                flags: [...commonChromeFlags, '--remote-debugging-port=9333'],
                debug: true
            },
            ChromeHeadlessOpt: {
                base: 'ChromeHeadless',
                flags: [...commonChromeFlags]
            }
        },
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
