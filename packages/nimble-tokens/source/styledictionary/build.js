(async () => {
    global.fastColorsParseColorHexRGBA = (await import('@microsoft/fast-colors')).parseColorHexRGBA;
    const StyleDictionary = require('style-dictionary');
    const nimbleExtensions = require('./nimble-extensions');
    const coreStyleDictionary = StyleDictionary.extend(nimbleExtensions);
    coreStyleDictionary.buildAllPlatforms();
})().catch(ex => {
    throw new Error(ex);
});
