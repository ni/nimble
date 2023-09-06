const path = require('path');

const iconAssetDir = path.resolve(__dirname, '../dist/icons/svg/*.svg');
const outputDir = path.resolve(__dirname, '../dist/icons/ts/');

console.log(`Icon asset directory :${iconAssetDir}`);
console.log(`Output ico directory :${outputDir}`);

const svgToTsConfig = {
    srcFiles: [
        iconAssetDir
    ],
    prefix: '',
    svgoConfig: {
        // https://github.com/svg/svgo#built-in-plugins
        plugins: [
            {
                name: 'preset-default',
                params: {
                    overrides: {
                        // customize default plugin options
                        removeUnknownsAndDefaults: {
                            keepDataAttrs: false,
                        },
                    },
                },
            }
        ],
    },
    fileName: 'index',
    outputDirectory: outputDir,
    interfaceName: 'NimbleIcon',
    typeName: 'NimbleIconName',
    exportCompleteIconSet: false
};

module.exports = svgToTsConfig;
