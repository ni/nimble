const playwright = require('playwright');
const path = require('path');
const karmaChromeLauncher = require('karma-chrome-launcher');
const karmaJasmine = require('karma-jasmine');
const karmaVite = require('karma-vite');

process.env.CHROME_BIN = playwright.chromium.executablePath();

module.exports = config => {
    config.set({
        basePath: path.resolve(__dirname),
        frameworks: ['vite', 'jasmine'],
        plugins: [karmaVite, karmaJasmine, karmaChromeLauncher],
        files: [
            {
                pattern: 'src/**/*.spec.ts',
                type: 'module',
                watched: false,
                served: false,
            },
        ],
        browsers: ['ChromeHeadless'],
        logLevel: config.LOG_ERROR,
        vite: {
            autoInit: true,
            config: {
                clearScreen: false,
                resolve: {
                    alias: {
                        '/base': '',
                    }
                }
            }
        }
    });
};