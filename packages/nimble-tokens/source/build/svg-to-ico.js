const path = require('path');
const glob = require('glob');
const fs = require('fs');
const svgToIco = require('svg-to-ico');

const inputPathGlob = path.resolve(__dirname, '../../assets-icons/*.svg');
const outputBasePath = path.resolve(__dirname, '../../dist-icons/');

if (!fs.existsSync(outputBasePath)) {
    fs.mkdirSync(outputBasePath);
}

glob(inputPathGlob, {}, (error, files) => {
    if (!error) {
        files.forEach(convertSvgToIco);
    }
});

function convertSvgToIco(filename) {
    svgToIco({
        input_name: filename,
        output_name: `${path.join(outputBasePath, path.parse(filename).name)}.ico`,
        sizes: [16, 24, 32, 64]
    });
}