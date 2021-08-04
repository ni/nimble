const svgToTsConfig = {
    srcFiles: ['./assets-icons/*.svg'],
    conversionType: 'constants',
    prefix: 'nimbleIcon',
    svgoConfig: {
        plugins: [
            {
                cleanupAttrs: true,
            },
        ],
    },
    fileName: 'nimble-icons.model',
    outputDirectory: './dist-icons',
};

module.exports = svgToTsConfig;
