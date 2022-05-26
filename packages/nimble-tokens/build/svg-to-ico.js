const path = require('path');
const glob = require('glob');
const fs = require('fs');
const svgToIco = require('svg-to-ico');

const iconAssetDir = path.resolve(__dirname, '../dist/icons/svg/');
const outputDir = path.resolve(__dirname, '../dist/icons/ico/');

console.log(`Icon asset directory :${iconAssetDir}`);
console.log(`Output ico directory :${outputDir}`);

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
}

const globPattern = '*.svg';
const iconAssetPaths = glob.sync(globPattern, {
    // glob paths should only have forward slashes
    // so run glob in resolved path (which has backslashes on windows)
    cwd: iconAssetDir,
    absolute: true
});

if (iconAssetPaths.length <= 0) {
    throw new Error(`No files found at path ${globPattern}`);
}

console.log(`Number of icons found to convert: ${iconAssetPaths.length}`);

(async () => {
    for (const iconAssetPath of iconAssetPaths) {
        // Print a simple marker to see progress of the icon generation
        process.stdout.write('.');

        const icoFileName = `${path.parse(iconAssetPath).name}.ico`;
        const icoPath = path.resolve(outputDir, icoFileName);

        // Generate icons on disk one at a time
        // eslint-disable-next-line no-await-in-loop
        await svgToIco({
            input_name: iconAssetPath,
            output_name: icoPath,
            sizes: [16, 32]
        });
    }

    console.log('\nFinished generating .ico files');
})().catch(ex => {
    throw new Error(ex);
});
