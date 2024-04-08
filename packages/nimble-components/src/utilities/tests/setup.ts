// Import all the test files to run in browser

function importAll(r: __WebpackModuleApi.RequireContext): void {
    r.keys().forEach(r);
}

// browser test configuration setup
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('./setup-configuration.js');

// all browser test scripts
importAll(require.context('../../wafer-map', true, /\.spec\.js$/));
importAll(
    require.context(
        '../../../../build/generate-workers/dist/esm',
        true,
        /\.spec\.js$/
    )
);
