const playwright = require('playwright');

process.env.WEBKIT_HEADLESS_BIN = playwright.webkit.executablePath();
process.env.WEBKIT_BIN = playwright.webkit.executablePath();
process.env.FIREFOX_BIN = playwright.firefox.executablePath();
process.env.CHROME_BIN = playwright.chromium.executablePath();

const path = require('path');
const karmaVite = require('karma-vite');
const karmaJasmine = require('karma-jasmine');
const karmaJasmineHtmlReporter = require('karma-jasmine-html-reporter');
const karmaJasmineSpecTags = require('karma-jasmine-spec-tags');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaFirefoxLauncher = require('karma-firefox-launcher');
const karmaWebkitLauncher = require('karma-webkit-launcher');

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
    '--lang=en-US',
    '--time-zone-for-testing=America/Chicago'
];

module.exports = config => {
    const options = {
        basePath,
        browserDisconnectTimeout: 10000,
        processKillTimeout: 10000,
        frameworks: [
            'vite',
            'jasmine',
            'jasmine-spec-tags'
        ],
        plugins: [
            karmaVite,
            karmaJasmine,
            karmaJasmineHtmlReporter,
            karmaJasmineSpecTags,
            karmaChromeLauncher,
            karmaFirefoxLauncher,
            karmaWebkitLauncher
        ],
        files: [
            {
                pattern: 'src/utilities/tests/setup-configuration.ts',
                type: 'module',
                watched: false,
                served: false,
            },
            {
                pattern: 'src/**/*.spec.ts',
                type: 'module',
                watched: false,
                served: false,
            },
            {
                pattern: 'build/generate-workers/**/*.spec.ts',
                type: 'module',
                watched: false,
                served: false,
            },
        ],
        mime: {
            'text/x-typescript': ['ts']
        },
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
            },
            FirefoxDebugging: {
                base: 'Firefox',
                debug: true
            },
            WebkitDebugging: {
                base: 'Webkit',
                debug: true
            }
        },
        client: {
            jasmine: {
                stopSpecOnExpectationFailure: false
            },
            captureConsole: true
        },
        logLevel: config.LOG_ERROR, // to disable the WARN 404 for image requests
        customHeaders: [
            // Test under the OWASP Basic non-strict CSP Policy
            // See: https://cheatsheetseries.owasp.org/cheatsheets/Content_Security_Policy_Cheat_Sheet.html#basic-non-strict-csp-policy
            // Need script-src 'unsafe-inline' to support karma behavior
            // See: https://github.com/karma-runner/karma/issues/3260
            // Need style-src 'unsafe-inline' to support FAST
            // See: https://github.com/microsoft/fast/issues/4510
            // Need worker-src blob: to support current worker loading pattern
            {
                match: '\\.html',
                name: 'Content-Security-Policy',
                value: "default-src 'self'; frame-ancestors 'self'; form-action 'self'; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; worker-src 'self' blob: ;"
            }
        ],
        vite: {
            config: {
                resolve: {
                    alias: {
                        '/base': '',
                    }
                }
            }
        }
    };

    config.set(options);
};
