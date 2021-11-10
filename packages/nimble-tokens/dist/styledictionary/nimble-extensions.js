const config = require('./config');
const StyleDictionary = require('style-dictionary');

// Workaround to include TypeScript definitions in output.
// See: https://github.com/AdobeXD/design-system-package-dsp/issues/22

config.platforms.js.files.push({
    "destination": "tokens.d.ts",
    "format": "typescript/es6-declarations"
});

module.exports = config;

StyleDictionary.registerTransform({
    type: `value`,
    transitive: true,
    name: `font/weight`,
    matcher: (token) => token.attributes.category === 'font',
    transformer: (token) => {
        if (token.value == 'Light') token.value = '300'; 
        else if (token.value == 'Regular') token.value = '400'; 
        else if (token.value == 'Semibold') token.value = '600'; 
        else if (token.value == 'Bold') token.value = '700'; 
        return token.value;
    }
})

// Combination of DSP & Nimble transform overrides
StyleDictionary.registerTransformGroup({
    name: 'css',
    transforms: [
        'attribute/cti',
        'name/dsp/kebab', //replaces 'name/cti/kebab',
        'time/seconds',
        'content/icon',
        'size/px', //replaces size/rem from DSP config
        'color/css',
        'font/weight'
    ]
});

// Combination of DSP & Nimble transform overrides
StyleDictionary.registerTransformGroup({
    name: 'js',
    transforms: [
        'attribute/cti',
        'name/dsp/pascal', //replaces 'name/cti/pascal',
        'size/px', //replaces size/rem from DSP config
        'color/hex',
        'font/weight'
    ]
});