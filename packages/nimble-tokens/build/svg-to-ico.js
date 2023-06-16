const path = require('path');
const glob = require('glob');
const fs = require('fs');
const fsp = require('fs/promises');
const sharp = require('sharp');
const toIcon = require('to-ico');

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
    absolute: true,
    nodir: true
});

if (iconAssetPaths.length <= 0) {
    throw new Error(`No files found at path ${globPattern}`);
}

console.log(`Number of icons found to convert: ${iconAssetPaths.length}`);

async function svgToIco({
    inputName,
    outputName,
    sizes
}) {
    const buffers = [];
    for (const size of sizes) {
        // Intentionally serializing each loop. Otherwise, we get mysteriously get hangs.
        // eslint-disable-next-line no-await-in-loop
        const buffer = await sharp(inputName)
            .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
            .png({ compressionLevel: 0 })
            .toBuffer();
        buffers.push(buffer);
    }

    await toIcon(buffers).then(outputBuffer => {
        fsp.writeFile(outputName, outputBuffer);
    });
}

(async () => {
    for (const iconAssetPath of iconAssetPaths) {
        // Print a simple marker to see progress of the icon generation
        process.stdout.write('.');

        const icoFileName = `${path.parse(iconAssetPath).name}.ico`;
        const icoPath = path.resolve(outputDir, icoFileName);

        // Generate icons on disk one at a time
        // eslint-disable-next-line no-await-in-loop
        await svgToIco({
            inputName: iconAssetPath,
            outputName: icoPath,
            sizes: [16, 32]
        });
    }

    console.log('\nFinished generating .ico files');
})().catch(ex => {
    throw new Error(ex);
});
