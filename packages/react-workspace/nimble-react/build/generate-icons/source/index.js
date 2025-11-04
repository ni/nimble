/**
 * Build script for generating React wrappers for Nimble icon components.
 */
import { pascalCase, spinalCase } from '@ni/fast-web-utilities';
import * as icons from '@ni/nimble-tokens/dist/icons/js';

const fs = require('fs');
const path = require('path');

const trimSizeFromName = text => {
    // Remove dimensions from icon name, e.g. "add16X16" -> "add"
    return text.replace(/\d+X\d+$/, '');
};

/**
 * Gets list of multi-color icon names from icon-metadata.ts in nimble-components
 * Uses regex to parse the TypeScript file since we can't directly import it in Node.js
 * @returns {string[]} Array of icon names in spinal-case (e.g., ['circle-partial-broken'])
 */
function getMultiColorIconNames() {
    // Resolve from the script location (works both in source and bundled dist)
    const scriptDir = path.dirname(fs.realpathSync(__filename));
    const metadataPath = path.resolve(
        scriptDir,
        '../../../../../nimble-components/src/icon-base/tests/icon-metadata.ts'
    );

    if (!fs.existsSync(metadataPath)) {
        console.warn('[generate-icons] Warning: icon-metadata.ts not found at', metadataPath);
        return [];
    }

    const content = fs.readFileSync(metadataPath, 'utf-8');

    // Match pattern: IconName: { tags: [...], multiColor: true }
    const multiColorPattern = /Icon([A-Z][a-zA-Z0-9]*):\s*\{[^}]*multiColor:\s*true[^}]*\}/g;
    const matches = content.matchAll(multiColorPattern);

    const multiColorIcons = [];
    for (const match of matches) {
        const pascalCaseName = match[1]; // e.g., "CirclePartialBroken"
        const spinalCaseName = pascalCaseName.replace(
            /[A-Z]/g,
            (letter, offset) => (offset > 0 ? `-${letter.toLowerCase()}` : letter.toLowerCase())
        );
        multiColorIcons.push(spinalCaseName);
    }

    return multiColorIcons;
}

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-react/build/generate-icons\n`;

// Icons that should not be generated (manually created multi-color icons)
// This is automatically populated from icon-metadata.ts in nimble-components
const manualIconsList = getMultiColorIconNames();
const manualIcons = new Set(manualIconsList);

if (manualIconsList.length > 0) {
    console.log(
        `[generate-icons] Found ${manualIconsList.length} multi-color icon(s) to skip: ${manualIconsList.join(', ')}`
    );
}

const iconsDirectory = path.resolve(__dirname, '../../../src/icons');

if (fs.existsSync(iconsDirectory)) {
    console.log(`Deleting existing icons directory "${iconsDirectory}"`);
    fs.rmSync(iconsDirectory, { recursive: true });
    console.log('Finished deleting existing icons directory');
}
console.log(`Creating icons directory "${iconsDirectory}"`);
fs.mkdirSync(iconsDirectory);

console.log('Finished creating icons directory');

console.log('Writing icon react wrapper files');

let fileCount = 0;
for (const key of Object.keys(icons)) {
    const iconName = trimSizeFromName(key); // e.g. "arrowExpanderLeft"
    const fileName = spinalCase(iconName); // e.g. "arrow-expander-left";

    // Skip icons that are manually created (e.g., multi-color icons)
    if (manualIcons.has(fileName)) {
        console.log(`[generate-icons] Skipping ${fileName} (manually created)`);
        continue;
    }

    const className = `Icon${pascalCase(iconName)}`; // e.g. "IconArrowExpanderLeft"

    fileCount += 1;

    const iconReactWrapperContent = `${generatedFilePrefix}
import { ${className} } from '@ni/nimble-components/dist/esm/icons/${fileName}';
import { wrap } from '../utilities/react-wrapper';

export { type ${className} };
export const Nimble${className} = wrap(${className});`;

    const outputPath = path.resolve(iconsDirectory, `${fileName}.ts`);
    fs.writeFileSync(outputPath, iconReactWrapperContent, {
        encoding: 'utf-8'
    });
}
console.log(`Finshed writing ${fileCount} icon react wrapper files`);
