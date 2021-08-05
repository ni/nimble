const path = require('path');

const svgToTsConfig = {
    srcFiles: [
        path.resolve(__dirname, '../../assets-icons/*.svg')
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
    fileName: 'nimble-icons-inline',
    outputDirectory: path.resolve(__dirname, '../../dist-icons'),
    interfaceName: 'NimbleIcon',
    typeName: 'NimbleIconName'
};

module.exports = svgToTsConfig;
