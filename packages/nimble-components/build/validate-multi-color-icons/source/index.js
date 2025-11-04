/**
 * Build-time validation for multi-color icons
 *
 * This script validates that manually-created multi-color icons meet requirements:
 * 1. Icon files exist in src/icons-multicolor/
 * 2. Layer count doesn't exceed MAX_ICON_LAYERS (6)
 * 3. manualIcons Set in generate-icons matches actual files
 */

const fs = require('fs');
const path = require('path');

const MAX_ICON_LAYERS = 6;

// This should match the Set in generate-icons/source/index.js
const manualIcons = new Set(['circlePartialBroken']);

const iconsMulticolorDirectory = path.resolve(
    __dirname,
    '../../../src/icons-multicolor'
);

/**
 * Count the number of cls-N classes in an SVG string
 */
function countLayersInSvg(svgData) {
    const classMatches = svgData.match(/class="cls-\d+"/g);
    if (!classMatches) {
        return 0;
    }
    const classNumbers = classMatches.map(match => {
        const num = match.match(/\d+/);
        return num ? parseInt(num[0], 10) : 0;
    });
    return Math.max(...classNumbers, 0);
}

/**
 * Extract SVG data from icon token import
 */
function extractSvgFromIconFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');

    // Match pattern: import { iconName16X16 } from '@ni/nimble-tokens/dist/icons/js';
    const importMatch = content.match(/import\s*{\s*([a-zA-Z0-9]+)\s*}/);
    if (!importMatch) {
        return null;
    }

    const iconName = importMatch[1];

    // Try to load the icon from nimble-tokens
    try {
        // eslint-disable-next-line import/no-dynamic-require, global-require
        const icons = require('@ni/nimble-tokens/dist/icons/js');
        const icon = icons[iconName];
        return icon ? icon.data : null;
    } catch {
        return null;
    }
}

console.log('[validate-multi-color-icons] Starting validation...\n');

// Validate that manualIcons Set matches actual files
console.log('[validate-multi-color-icons] Validating manualIcons Set...');
const actualFiles = fs.existsSync(iconsMulticolorDirectory)
    ? fs
        .readdirSync(iconsMulticolorDirectory)
        .filter(f => f.endsWith('.ts'))
        .map(f => {
            // Convert file name to icon name: circle-partial-broken.ts -> circlePartialBroken
            const fileName = path.basename(f, '.ts');
            return fileName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());
        })
    : [];

const missingFromSet = actualFiles.filter(name => !manualIcons.has(name));
const missingFiles = Array.from(manualIcons).filter(
    name => !actualFiles.includes(name)
);

if (missingFromSet.length > 0) {
    console.error(
        `[validate-multi-color-icons] ERROR: Files exist but not in manualIcons Set: ${missingFromSet.join(', ')}`
    );
    console.error(
        '[validate-multi-color-icons] Update manualIcons Set in build/generate-icons/source/index.js'
    );
    process.exit(1);
}

if (missingFiles.length > 0) {
    console.error(
        `[validate-multi-color-icons] ERROR: manualIcons Set includes ${missingFiles.join(', ')} but files don't exist`
    );
    console.error(
        '[validate-multi-color-icons] Remove from manualIcons Set in build/generate-icons/source/index.js'
    );
    process.exit(1);
}

console.log('[validate-multi-color-icons] ✓ manualIcons Set matches files\n');

// Validate layer counts
console.log('[validate-multi-color-icons] Validating layer counts...');
let hasErrors = false;

for (const iconName of manualIcons) {
    const fileName = iconName
        .replace(/([A-Z])/g, (_match, letter) => `-${letter.toLowerCase()}`)
        .replace(/^-/, '');
    const filePath = path.resolve(iconsMulticolorDirectory, `${fileName}.ts`);

    if (!fs.existsSync(filePath)) {
        continue; // Already reported above
    }

    const svgData = extractSvgFromIconFile(filePath);
    if (!svgData) {
        console.warn(
            `[validate-multi-color-icons] WARNING: Could not extract SVG data from ${fileName}.ts`
        );
        continue;
    }

    const layerCount = countLayersInSvg(svgData);
    if (layerCount > MAX_ICON_LAYERS) {
        console.error(
            `[validate-multi-color-icons] ERROR: Icon ${iconName} has ${layerCount} layers but max is ${MAX_ICON_LAYERS}`
        );
        hasErrors = true;
    } else {
        console.log(
            `[validate-multi-color-icons] ✓ ${iconName}: ${layerCount} layers`
        );
    }
}

if (hasErrors) {
    console.error('\n[validate-multi-color-icons] Validation FAILED');
    console.error(`Icons must not exceed ${MAX_ICON_LAYERS} layers.`);
    console.error(
        'Either reduce layer count in the SVG or increase MAX_ICON_LAYERS in multi-color.ts'
    );
    process.exit(1);
}

console.log('\n[validate-multi-color-icons] All validations passed ✓');
