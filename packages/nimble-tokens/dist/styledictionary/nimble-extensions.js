const config = require('./config');
const fs = require('fs');
const _ = require('lodash');
const path = require('path');
const hexRgb = require('hex-rgb');
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

// Templates and transforms to build XAML compatible token resource dictionaries
const colorTemplate = _.template(fs.readFileSync(path.resolve(__dirname, './templates/XamlColor.template')));
StyleDictionary.registerFormat({
    name: 'xaml/XamlColor',
    formatter: colorTemplate
});

StyleDictionary.registerTransformGroup({
    name: 'ni-xaml-color',
    transforms: [
      'attribute/cti',
      'size/px',
      'color/hex8android'
    ]
  });

  const xamlStyleDictionary = StyleDictionary.extend(
    {
        "source": [
          "properties/colors.json"
        ],
        "platforms": {
            "xaml": {
                "files": [
                    {
                        "destination": "colors.xaml",
                        "format": "xaml/XamlColor"
                    }
                ],
                "transformGroup": "ni-xaml-color",
                "buildPath": "xaml/"
            }
        }   
  });

// Templates and transforms to build C# token class
const colorClassTemplate = _.template(fs.readFileSync(path.resolve(__dirname, './templates/ColorClass.template')));
StyleDictionary.registerFormat({
    name: 'cs/ColorClass',
    formatter: colorClassTemplate
});

StyleDictionary.registerTransform({
    type: `value`,
    transitive: true,
    name: `color/FromRgb`,
    matcher: (token) => token.attributes.category === 'color',
    transformer: (token) => {
        const color = hexRgb(token.value);
        return `${color.red}, ${color.green}, ${color.blue}`;
    }
})

StyleDictionary.registerTransformGroup({
    name: 'ni-color-class',
    transforms: [
        'attribute/cti',
        'name/ti/camel',
        'color/FromRgb'
    ]
});

  const csClassStyleDictionary = StyleDictionary.extend(
    {
        "source": [
          "properties/colors.json",
        ],
        "platforms": {
            "xaml": {
                "files": [
                    {
                        "destination": "colors.cs",
                        "format": "cs/ColorClass"
                    }
                ],
                "transformGroup": "ni-color-class",
                "buildPath": "cs/"
            }
        }   
  });
  
  xamlStyleDictionary.buildAllPlatforms();
  csClassStyleDictionary.buildAllPlatforms();

