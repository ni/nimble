const path = require('path');
const glob = require('glob');
const fs = require('fs');
const svgToIco = require('svg-to-ico');

const iconAssetDir = path.resolve(__dirname, '../../assets-icons/');
const outputDir = path.resolve(__dirname, '../../dist-ico/');

console.log(`Icon asset directory :${iconAssetDir}`);
console.log(`Output ico directory :${outputDir}`);

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const iconAssetPaths = glob.sync('*.svg', {
    // glob paths should only have forward slashes
    // so run glob in resolved path (which has backslashes on windows)
    cwd: iconAssetDir,
    absolute: true
});

if (iconAssetPaths.length <= 0) {
    throw new Error('No icon svg files found to convert');
}

console.log(`Number of icons found to convert: ${iconAssetPaths.length}`);

iconAssetPaths.forEach(iconAssetPath => {
    const icoFileName = `${path.parse(iconAssetPath).name}.ico`;
    const icoPath = path.resolve(outputDir, icoFileName);
    svgToIco({
        input_name: iconAssetPath,
        output_name: icoPath,
        sizes: [16, 32, 64]
    });
});
