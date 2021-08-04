const path = require('path');

const svgToTsConfig = {
    srcFiles: [
        path.resolve(__dirname, '../../assets-icons/*.svg')
    ],
    conversionType: 'constants',
    prefix: '',
    svgoConfig: {
        plugins: [
            {
                cleanupAttrs: true,
            },
        ],
    },
    fileName: 'nimble-icons-inline',
    outputDirectory: path.resolve(__dirname, '../../dist-icons'),
    interfaceName: 'NimbleIcons',
    typeName: 'NimbleIconName'
};

module.exports = svgToTsConfig;
