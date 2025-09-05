// Based on fast-components configuration:
// https://github.com/microsoft/fast/blob/6549309c1ed2dea838561d23fea6337ef16d7908/packages/web-components/fast-components/karma.conf.js
// Coverage from the fast configuration removed due to lack of Webpack 5 support:
// https://github.com/webpack-contrib/istanbul-instrumenter-loader/issues/110

const playwright = require('playwright');

process.env.WEBKIT_HEADLESS_BIN = playwright.webkit.executablePath();
process.env.WEBKIT_BIN = playwright.webkit.executablePath();
process.env.FIREFOX_BIN = playwright.firefox.executablePath();
process.env.CHROME_BIN = playwright.chromium.executablePath();

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
    '--lang=en-US',
    '--time-zone-for-testing=America/Chicago'
];

module.exports = config => {
    const options = {
        basePath,
        browserDisconnectTimeout: 10000,
        processKillTimeout: 10000,
        frameworks: [
            'source-map-support',
            'jasmine',
            'webpack',
            'jasmine-spec-tags'
        ],
        plugins: [
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-jasmine-spec-tags',
            'karma-webpack',
            'karma-source-map-support',
            'karma-sourcemap-loader',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-webkit-launcher'
        ],
        files: ['dist/esm/utilities/tests/setup.js'],
        preprocessors: {
            'dist/esm/utilities/tests/setup.js': ['webpack', 'sourcemap']
        },
        webpackMiddleware: {
            // webpack-dev-middleware configuration
            // i. e.
            stats: 'errors-only'
        },
        webpack: {
            mode: 'none',
            resolve: {
                extensions: ['.js'],
                modules: ['dist', 'node_modules'],
                mainFields: ['module', 'main']
            },
            devtool: 'inline-source-map',
            performance: {
                hints: false
            },
            optimization: {
                nodeEnv: false,
                usedExports: true,
                flagIncludedChunks: false,
                sideEffects: true,
                concatenateModules: true,
                splitChunks: {
                    name: false
                },
                runtimeChunk: false,
                checkWasmTypes: false,
                minimize: false
            },
            module: {
                rules: [
                    {
                        test: /\.js\.map$/,
                        use: ['ignore-loader']
                    },
                    {
                        test: /\.js$/,
                        enforce: 'pre',
                        use: [
                            {
                                loader: 'source-map-loader'
                            }
                        ]
                    }
                ]
            }
        },
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
        ]
    };

    config.set(options);
};
