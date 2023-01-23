// Based on fast-components configuration:
// https://github.com/microsoft/fast/blob/6549309c1ed2dea838561d23fea6337ef16d7908/packages/web-components/fast-components/karma.conf.js
// Coverage from the fast configuration removed due to lack of Webpack 5 support:
// https://github.com/webpack-contrib/istanbul-instrumenter-loader/issues/110

process.env.CHROME_BIN = require('puppeteer').executablePath();
const path = require('path');
const webpack = require('webpack');

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
    '--force-prefers-reduced-motion'
];

// Create a webpack environment plugin to use while running tests so that
// functionality that accesses the environment, such as the TanStack table
// within the nimble-table, work correctly.
// Note: Unless we run the tests twice, we have to choose to either run them
// against the 'production' configuration or the 'development' configuration.
// Because we expect shipping apps to use the 'production' configuration, we
// have chosen to run tests aginst that configuration.
const webpackEnvironmentPlugin = new webpack.EnvironmentPlugin({
    NODE_ENV: 'production'
});

module.exports = config => {
    const options = {
        basePath,
        browserDisconnectTimeout: 10000,
        processKillTimeout: 10000,
        frameworks: ['source-map-support', 'jasmine', 'webpack'],
        plugins: [
            'karma-jasmine',
            'karma-jasmine-html-reporter',
            'karma-webpack',
            'karma-source-map-support',
            'karma-sourcemap-loader',
            'karma-chrome-launcher',
            'karma-firefox-launcher',
            'karma-safari-launcher'
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
            },
            plugins: [webpackEnvironmentPlugin]
        },
        mime: {
            'text/x-typescript': ['ts']
        },
        reporters: ['kjhtml'],
        browsers: ['ChromeHeadlessOpt', 'Firefox', 'Safari'],
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
