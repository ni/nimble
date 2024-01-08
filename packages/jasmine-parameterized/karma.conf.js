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
            'source-map-support',
            'jasmine',
            'webpack'
        ],
        plugins: [
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-webpack',
            'karma-source-map-support',
            'karma-sourcemap-loader',
            'karma-chrome-launcher'
        ],
        files: ['./dist/**/tests/**/*.spec.js'],
        preprocessors: {
            // add webpack as preprocessor
            './dist/**/tests/**/*.spec.js': ['webpack']
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
            }
        },
        client: {
            captureConsole: true
        },
        logLevel: config.LOG_ERROR // to disable the WARN 404 for image requests
    };

    config.set(options);
};
