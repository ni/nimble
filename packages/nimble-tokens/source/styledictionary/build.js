require('./config');
require('./nimble-extensions');
const StyleDictionary = require('style-dictionary');

(async () => {
    global.fastColorsParseColorHexRGBA = (await import('@microsoft/fast-colors')).parseColorHexRGBA;

    const coreStyleDictionary = StyleDictionary.extend(
        {
            source: [
                'properties/colors.json',
                'properties/fonts.json',
                'properties/custom.json',
                'properties/sizes.json'
            ],
            platforms: {
                css: {
                    files: [
                        {
                            destination: 'variables.css',
                            format: 'css/variables'
                        }
                    ],
                    transformGroup: 'css',
                    buildPath: '../../dist/styledictionary/css/'
                },
                js: {
                    files: [
                        {
                            destination: 'tokens.js',
                            format: 'javascript/es6'
                        },
                        {
                            destination: 'tokens.d.ts',
                            format: 'typescript/es6-declarations'
                        }
                    ],
                    transformGroup: 'js',
                    buildPath: '../../dist/styledictionary/js/'
                },
                scss: {
                    files: [
                        {
                            destination: 'variables.scss',
                            format: 'scss/variables'
                        }
                    ],
                    transformGroup: 'scss',
                    buildPath: '../../dist/styledictionary/scss/'
                }
            }
        }
    );

    const xamlStyleDictionary = StyleDictionary.extend(
        {
            source: [
                'properties/colors.json'
            ],
            platforms: {
                xaml: {
                    files: [
                        {
                            destination: 'colors.xaml',
                            format: 'xaml/XamlColor'
                        }
                    ],
                    transformGroup: 'ni-xaml-color',
                    buildPath: '../../dist/styledictionary/xaml/'
                }
            }
        }
    );

    const cSharpClassStyleDictionary = StyleDictionary.extend(
        {
            source: [
                'properties/colors.json',
            ],
            platforms: {
                xaml: {
                    files: [
                        {
                            destination: 'colors.cs',
                            format: 'cSharpClass/Color'
                        }
                    ],
                    transformGroup: 'ni-color-class',
                    buildPath: '../../dist/styledictionary/csharp/'
                }
            }
        }
    );

    coreStyleDictionary.buildAllPlatforms();
    xamlStyleDictionary.buildAllPlatforms();
    cSharpClassStyleDictionary.buildAllPlatforms();
})().catch(ex => {
    throw new Error(ex);
});
