/**
 * Build script for generating Nimble components for icons.
 *
 * Iterates through icons provided by nimble-tokens, and generates a Nimble component for each in
 * src/icons. Also generates an all-icons barrel file.
 */

import * as icons from '../../../../nimble-tokens/dist-icons-esm/nimble-icons-inline';

const fs = require('fs');
const path = require('path');

const trimSizeFromName = text => {
    // Remove dimensions from icon name, e.g. "add16X16" -> "add"
    return text.replace(/\d+X\d+$/, '');
};

const camelToPascalCase = text => {
    return text.substring(0, 1).toUpperCase() + text.substring(1);
};

const camelToKebabCase = text => {
    // Adapted from https://stackoverflow.com/a/67243723
    return text.replace(/[A-Z]+(?![a-z])|[A-Z]/g, (substring, offset) => (offset !== 0 ? '-' : '') + substring.toLowerCase());
};

const iconsDirectory = path.resolve(__dirname, '../../../src/icons');

if (fs.existsSync(iconsDirectory)) {
    console.log('Deleting existing icons directory');
    fs.rmSync(iconsDirectory, { recursive: true });
    console.log('Finished deleting existing icons directory');
}
console.log('Creating icons directory');
fs.mkdirSync(iconsDirectory);
console.log('Finished creating icons directory');

console.log('Writing icon component files');
let allIconsFileContents = '';
let fileCount = 0;
for (const key in icons) {
    if (Object.prototype.hasOwnProperty.call(icons, key)) {
        const svgName = key; // e.g. "arrowExpanderLeft16X16"
        const iconName = trimSizeFromName(key); // e.g. "arrowExpanderLeft"
        const elementName = `${camelToKebabCase(iconName)}-icon`; // e.g. "arrow-expander-left-icon"
        const className = `${camelToPascalCase(iconName)}Icon`; // e.g. "ArrowExpanderLeftIcon"

        const componentFileContents = `import { ${svgName} } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-${elementName}': ${className};
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

registerIcon('${elementName}', ${className});
`;

        const fileName = `${iconName}.ts`;
        const filePath = path.resolve(iconsDirectory, fileName);
        fs.writeFileSync(filePath, componentFileContents, { encoding: 'utf-8' });
        fileCount += 1;

        allIconsFileContents = allIconsFileContents.concat(`export { ${className} } from './${iconName}';\n`);
    }
}
console.log(`Finshed writing ${fileCount} icon component files`);

const allIconsFilePath = path.resolve(iconsDirectory, 'all-icons.ts');
console.log('Writing all-icons file');
fs.writeFileSync(allIconsFilePath, allIconsFileContents, { encoding: 'utf-8' });
console.log('Finished writing all-icons file');
