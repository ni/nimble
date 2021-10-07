const config = require('./config');
const fs = require('fs');
const _ = require('lodash');
const StyleDictionary = require('style-dictionary');

// Workaround to include TypeScript definitions in output.
// See: https://github.com/AdobeXD/design-system-package-dsp/issues/22

config.platforms.js.files.push({
    "destination": "tokens.d.ts",
    "format": "typescript/es6-declarations"
});

module.exports = config;

// Combination of DSP & Nimble transform overrides
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

// Combination of DSP & Nimble transform overrides
StyleDictionary.registerTransformGroup({
    name: 'js',
    transforms: [
        'attribute/cti',
        'name/dsp/pascal', //replaces 'name/cti/pascal',
        'size/px', //replaces size/rem from DSP config
        'color/hex',
    ]
});

const colorTemplate = _.template( fs.readFileSync('templates/XamlColor.template') );
StyleDictionary.registerFormat({
    name: 'xaml/XamlColor',
    formatter: colorTemplate
});

StyleDictionary.registerTransform({
    name: 'attribute/ctiwithapp',
    type: 'attribute',
    transformer : (prop) => {
        if (prop.path[0] === 'application') {
            const [ /* string "application" */, /* product name */, category, type] = prop.path;
            return {
                category,
                type
            };
        } else {
            // Fallback to the original 'attribute/cti' transformer
            return StyleDictionary.transform['attribute/cti'].transformer(prop);
        }
    }
});

StyleDictionary.registerTransformGroup({
    name: 'nxg-xaml-color',
    transforms: [
      'attribute/ctiwithapp',
      'size/px',
      'color/hex8android'
    ],
    buildPath: 'build/nxg/',
    files: [
      {
        filter: 'isNXGXamlColor',
        format: 'xaml/XamlColor',
        destination: 'Colors.xaml'
      }
    ]
  });

  const xamlStyleDictionary = StyleDictionary.extend(
    {
        "source": [
          "properties/colors.json",
          "properties/fonts.json",
          "properties/custom.json",
          "properties/sizes.json"
        ],
        "platforms": {
            "xaml": {
                "files": [
                    {
                        "destination": "colors.xaml",
                        "format": "xaml/XamlColor"
                    }
                ],
                "transformGroup": "nxg-xaml-color",
                "buildPath": "xaml/"
            }
        }   
  });
  
  xamlStyleDictionary.buildAllPlatforms();