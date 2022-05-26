const path = require('path');

const iconAssetDir = path.resolve(__dirname, '../dist/icons/svg/*.svg');
const outputDir = path.resolve(__dirname, '../dist/icons/ts/');

console.log(`Icon asset directory :${iconAssetDir}`);
console.log(`Output ico directory :${outputDir}`);

const svgToTsConfig = {
    srcFiles: [
        iconAssetDir
    ],
    conversionType: 'constants',
    prefix: '',
    svgoConfig: {
        // https://github.com/svg/svgo#built-in-plugins
        plugins: [
            {
                cleanupAttrs: true
            },
            {
                removeUnknownsAndDefaults: {
                    keepDataAttrs: false
                }
            },
        ],
    },
    fileName: 'icons',
    outputDirectory: outputDir,
    interfaceName: 'NimbleIcon',
    typeName: 'NimbleIconName'
};

module.exports = svgToTsConfig;
