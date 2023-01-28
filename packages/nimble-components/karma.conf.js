// Based on fast-components configuration:
// https://github.com/microsoft/fast/blob/6549309c1ed2dea838561d23fea6337ef16d7908/packages/web-components/fast-components/karma.conf.js

process.env.CHROME_BIN = require('puppeteer').executablePath();

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
    '--force-prefers-reduced-motion'
];

module.exports = config => {
    const options = {
        browserDisconnectTimeout: 10000,
        processKillTimeout: 10000,
        frameworks: ['vite', 'jasmine'],
        plugins: [
            'karma-vite',
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-chrome-launcher',
            'karma-firefox-launcher'
        ],
        files: [{
            pattern: 'src/**/*.spec.ts',
            type: 'module',
            watched: false,
            served: false,
        }],
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
        logLevel: config.LOG_ERROR // to disable the WARN 404 for image requests
    };

    config.set(options);
};
