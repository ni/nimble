const fs = require('fs');
const path = require('path');

// Note: This constant is duplicated in packages/nimble-components/src/icon-base/multi-color.ts
// Please ensure both are updated if this value changes.
const MAX_ICON_LAYERS = 6;
const multiColorDir = path.resolve(__dirname, '../dist/icons/svg-multicolor');
const singleColorDir = path.resolve(__dirname, '../dist/icons/svg-single');

function countLayersInSvg(svgContent) {
    const classMatches = svgContent.match(/class\s*=\s*["']cls-\d+["']/g);
    if (!classMatches) {
        return 0;
    }
    const classNumbers = classMatches.map(match => {
        const num = match.match(/\d+/);
        return num ? parseInt(num[0], 10) : 0;
    });
    return Math.max(...classNumbers, 0);
}

function validateMultiColorIcons() {
    if (!fs.existsSync(multiColorDir)) {
        console.log('No multi-color icons directory found. Skipping validation.');
        return;
    }

    const files = fs.readdirSync(multiColorDir).filter(f => f.endsWith('.svg'));
    let hasError = false;

    console.log(`Validating ${files.length} multi-color icons...`);

    for (const file of files) {
        const filePath = path.resolve(multiColorDir, file);
        const content = fs.readFileSync(filePath, 'utf-8');
        const layers = countLayersInSvg(content);

        if (layers > MAX_ICON_LAYERS) {
            console.error(`ERROR: ${file} has ${layers} layers. Max allowed is ${MAX_ICON_LAYERS}.`);
            hasError = true;
        }

        if (layers <= 1) {
            console.warn(`WARNING: ${file} has ${layers} layers. Should it be in single-color icons?`);
        }
    }

    if (hasError) {
        process.exit(1);
    }
}

function validateSingleColorIcons() {
    if (!fs.existsSync(singleColorDir)) {
        console.log('No single-color icons directory found. Skipping validation.');
    }

    // Optional: Check if single color icons accidentally have multi-color classes
    // This might be too strict if we use cls-1 for single color too, but usually single color icons don't use classes for fill.
}

validateMultiColorIcons();
validateSingleColorIcons();
console.log('Icon validation passed.');
