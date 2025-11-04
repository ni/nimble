/**
 * Build script for generating Nimble components for icons.
 *
 * Iterates through icons provided by nimble-tokens, and generates a Nimble component for each in
 * src/icons. Also generates an all-icons barrel file.
 *
 * Note: Multi-color icons should be created manually in src/icons-multicolor.
 * See CONTRIBUTING.md for instructions.
 */
import { pascalCase, spinalCase } from '@ni/fast-web-utilities';
import * as icons from '@ni/nimble-tokens/dist/icons/js';

const fs = require('fs');
const path = require('path');

const trimSizeFromName = text => {
    // Remove dimensions from icon name, e.g. "add16X16" -> "add"
    return text.replace(/\d+X\d+$/, '');
};

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-components/build/generate-icons\n`;

const {
    getMultiColorIconNames
} = require('../../shared/multi-color-icon-utils');

// Icons that should not be generated (manually created multi-color icons)
// This is now automatically populated from icon-metadata.ts
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

console.log('Writing icon component files');
let allIconsFileContents = `${generatedFilePrefix}\n`;

let fileCount = 0;
for (const key of Object.keys(icons)) {
    const svgName = key; // e.g. "arrowExpanderLeft16X16"
    const iconName = trimSizeFromName(key); // e.g. "arrowExpanderLeft"
    const fileName = spinalCase(iconName); // e.g. "arrow-expander-left";

    // Skip icons that are manually created (e.g., multi-color icons)
    if (manualIcons.has(fileName)) {
        console.log(`[generate-icons] Skipping ${fileName} (manually created)`);
        continue;
    }
    const elementBaseName = `icon-${spinalCase(iconName)}`; // e.g. "icon-arrow-expander-left-icon"
    const elementName = `nimble-${elementBaseName}`;
    const className = `Icon${pascalCase(iconName)}`; // e.g. "IconArrowExpanderLeft"
    const tagName = `icon${pascalCase(iconName)}Tag`; // e.g. "iconArrowExpanderLeftTag"

    const componentFileContents = `${generatedFilePrefix}
import { ${svgName} } from '@ni/nimble-tokens/dist/icons/js';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        '${elementName}': ${className};
    }
}

/**
 * The icon component for the '${iconName}' icon
 */
export class ${className} extends Icon {
    public constructor() {
        super(${svgName});
    }
}

registerIcon('${elementBaseName}', ${className});
export const ${tagName} = '${elementName}';
`;

    const filePath = path.resolve(iconsDirectory, `${fileName}.ts`);
    fs.writeFileSync(filePath, componentFileContents, { encoding: 'utf-8' });
    fileCount += 1;

    allIconsFileContents = allIconsFileContents.concat(
        `export { ${className} } from './${fileName}';\n`
    );
}
console.log(`Finished writing ${fileCount} icon component files`);

// Add manual icons to all-icons exports (from icons-multicolor directory)
for (const iconName of manualIcons) {
    const fileName = spinalCase(iconName);
    const className = `Icon${pascalCase(iconName)}`;
    allIconsFileContents = allIconsFileContents.concat(
        `export { ${className} } from '../icons-multicolor/${fileName}';\n`
    );
}

const allIconsFilePath = path.resolve(iconsDirectory, 'all-icons.ts');
console.log('Writing all-icons file');
fs.writeFileSync(allIconsFilePath, allIconsFileContents, { encoding: 'utf-8' });
console.log('Finished writing all-icons file');
