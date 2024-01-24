process.env.CHROME_BIN = require('playwright').chromium.executablePath();

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
            'jasmine',
        ],
        plugins: [
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-chrome-launcher'
        ],
        files: [
            // Test files
            { pattern: './dist/esm/**/*.spec.js', type: 'module' },
            // Library files and dependencies
            { pattern: './dist/esm/**/*.js', type: 'module', included: false },
            { pattern: './dist/esm/**/*.map', included: false },
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
        logLevel: config.LOG_ERROR
    };

    config.set(options);
};
