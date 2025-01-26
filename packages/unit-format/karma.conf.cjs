process.env.CHROME_BIN = require('playwright').chromium.executablePath();

const karmaVite = require('karma-vite');
const karmaJasmine = require('karma-jasmine');
const karmaJasmineHtmlReporter = require('karma-jasmine-html-reporter');
const karmaChromeLauncher = require('karma-chrome-launcher');

const path = require('path');

const basePath = path.resolve(__dirname);
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
    const options = {
        basePath,
        browserDisconnectTimeout: 10000,
        processKillTimeout: 10000,
        frameworks: [
            'vite',
            'jasmine',
        ],
        plugins: [
            karmaVite,
            karmaJasmine,
            karmaJasmineHtmlReporter,
            karmaChromeLauncher
        ],
        files: [
            // Test files
            { pattern: './src/**/*.spec.ts', type: 'module', watched: false, served: false },
        ],
        reporters: ['kjhtml'],
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
        client: {
            captureConsole: true
        },
        // to disable the WARN 404 for image requests
        logLevel: config.LOG_ERROR,
        customHeaders: [
            // Test under the OWASP Basic non-strict CSP Policy
            // See: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html#basic-non-strict-csp-policy
            // Need script-src 'unsafe-inline' to support karma behavior
            // See https://github.com/karma-runner/karma/issues/3260
            {
                match: '\\.html',
                name: 'Content-Security-Policy',
                value: "default-src 'self'; frame-ancestors 'self'; form-action 'self'; object-src 'none'; script-src 'self' 'unsafe-inline';"
            }
        ]
    };

    config.set(options);
};
