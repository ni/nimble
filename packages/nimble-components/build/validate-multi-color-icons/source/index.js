/**
 * Build-time validation for multi-color icons
 *
 * This script validates that manually-created multi-color icons meet requirements:
 * 1. Icon files exist in src/icons-multicolor/
 * 2. Layer count doesn't exceed MAX_ICON_LAYERS (6)
 * 3. Metadata in nimble-tokens matches actual files in src/icons-multicolor/
 */

const fs = require('fs');
const path = require('path');

// Import from local source file
const {
    multiColorIcons
    // eslint-disable-next-line import/extensions
} = require('../../../src/icon-base/tests/icon-multicolor-metadata-data.js');

const MAX_ICON_LAYERS = 6;

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

// Validate that nimble-tokens metadata entries match actual files
console.log(
    '[validate-multi-color-icons] Validating nimble-tokens metadata matches files...'
);
const actualFiles = fs.existsSync(iconsMulticolorDirectory)
    ? fs
        .readdirSync(iconsMulticolorDirectory)
        .filter(f => f.endsWith('.ts'))
        .map(f => path.basename(f, '.ts')) // Keep in spinal-case: circle-partial-broken
    : [];

const multiColorIconsSet = new Set(multiColorIcons);
const missingFromMetadata = actualFiles.filter(
    name => !multiColorIconsSet.has(name)
);
const missingFiles = multiColorIcons.filter(
    name => !actualFiles.includes(name)
);

if (missingFromMetadata.length > 0) {
    console.error(
        `[validate-multi-color-icons] ERROR: Files exist but not in nimble-tokens metadata: ${missingFromMetadata.join(', ')}`
    );
    console.error(
        '[validate-multi-color-icons] Remediation: Add these icons to multiColorIcons array in nimble-tokens/source/icon-metadata.ts'
    );
    process.exit(1);
}

if (missingFiles.length > 0) {
    console.error(
        `[validate-multi-color-icons] ERROR: nimble-tokens metadata lists ${missingFiles.join(', ')} but files don't exist`
    );
    console.error(
        '[validate-multi-color-icons] Remediation: Either create the files in src/icons-multicolor/ or remove from nimble-tokens/source/icon-metadata.ts'
    );
    process.exit(1);
}

console.log(
    '[validate-multi-color-icons] ✓ nimble-tokens metadata matches files\n'
);

// Validate layer counts
console.log('[validate-multi-color-icons] Validating layer counts...');
let hasErrors = false;

for (const iconName of multiColorIcons) {
    // iconName is already in spinal-case (e.g., "circle-partial-broken")
    const filePath = path.resolve(iconsMulticolorDirectory, `${iconName}.ts`);

    if (!fs.existsSync(filePath)) {
        continue; // Already reported above
    }

    const svgData = extractSvgFromIconFile(filePath);
    if (!svgData) {
        console.error(
            `[validate-multi-color-icons] ERROR: Could not extract SVG data from ${iconName}.ts`
        );
        console.error(
            '[validate-multi-color-icons] Remediation: Ensure the icon file imports a valid SVG from nimble-tokens'
        );
        process.exit(1);
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
