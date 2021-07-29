// Import all the test files to run in browser

function importAll(r: __WebpackModuleApi.RequireContext): void {
    r.keys().forEach(r);
}

// Explicitly add to browser test
importAll(require.context('../../', true, /\.spec\.js$/));
