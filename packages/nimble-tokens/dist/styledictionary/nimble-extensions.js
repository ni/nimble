const config = require('./config');

// Workaround to include TypeScript definitions in output.
// See: https://github.com/AdobeXD/design-system-package-dsp/issues/22

config.platforms.js.files.push({
    "destination": "tokens.d.ts",
    "format": "typescript/es6-declarations"
});

module.exports = config;
