const config = require('./config');
const StyleDictionary = require('style-dictionary');

// Workaround to include TypeScript definitions in output.
// See: https://github.com/AdobeXD/design-system-package-dsp/issues/22

config.platforms.js.files.push({
    "destination": "tokens.d.ts",
    "format": "typescript/es6-declarations"
});

module.exports = config;

// Override default transform groups with custom name transform
StyleDictionary.registerTransformGroup({
    name: 'css',
    transforms: [
        'attribute/cti',
        'name/dsp/kebab', //replaces 'name/cti/kebab',
        'time/seconds',
        'content/icon',
        'size/px', //replaces size/rem from DSP config
        'color/css'
    ]
});