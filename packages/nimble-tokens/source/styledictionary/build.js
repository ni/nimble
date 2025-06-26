import './config.js';
import StyleDictionary from 'style-dictionary';

const coreStyleDictionary = new StyleDictionary(
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
                transformGroup: 'nimble/css',
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
                transformGroup: 'nimble/js',
                buildPath: '../../dist/styledictionary/js/'
            },
            scss: {
                files: [
                    {
                        destination: 'variables.scss',
                        format: 'scss/variables'
                    }
                ],
                transformGroup: 'nimble/scss',
                buildPath: '../../dist/styledictionary/scss/'
            }
        }
    }
);

await coreStyleDictionary.hasInitialized;

coreStyleDictionary.buildAllPlatforms();
