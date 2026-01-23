/**
 * Build script for generating Nimble components for icons.
 */
import { pascalCase, spinalCase } from '@ni/fast-web-utilities';
import * as icons from '@ni/nimble-tokens/dist/icons/js/index.js';
import * as path from 'node:path';
import * as fs from 'node:fs';

const trimSizeFromName = text => {
    // Remove dimensions from icon name, e.g. "add16X16" -> "add"
    return text.replace(/\d+X\d+$/, '');
};

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-components/build/generate-icons\n`;

const iconsDirectory = path.resolve(import.meta.dirname, '../src/icons');

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
    const directoryName = spinalCase(iconName); // e.g. "arrow-expander-left"
    const elementBaseName = `icon-${spinalCase(iconName)}`; // e.g. "icon-arrow-expander-left-icon"
    const elementName = `nimble-${elementBaseName}`;
    const className = `Icon${pascalCase(iconName)}`; // e.g. "IconArrowExpanderLeft"
    const tagName = `icon${pascalCase(iconName)}Tag`; // e.g. "iconArrowExpanderLeftTag"
    const iconDirectory = path.resolve(iconsDirectory, directoryName);
    fs.mkdirSync(iconDirectory);

    fileCount += 1;

    const componentFileContents = `${generatedFilePrefix}
import { ${svgName} } from '@ni/nimble-tokens/dist/icons/js';
import { SvgIcon, registerSvgIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        '${elementName}': ${className};
    }
}

/**
 * The icon component for the '${iconName}' icon
 */
export class ${className} extends SvgIcon {
    public constructor() {
        super(${svgName});
    }
}

registerSvgIcon('${elementBaseName}', ${className});
export const ${tagName} = '${elementName}';
`;

    const filePath = path.resolve(iconDirectory, 'index.ts');
    fs.writeFileSync(filePath, componentFileContents, { encoding: 'utf-8' });

    allIconsFileContents = allIconsFileContents.concat(
        `export { ${className} } from './${directoryName}';\n`
    );
}
console.log(`Finshed writing ${fileCount} icon component files`);

const allIconsFilePath = path.resolve(iconsDirectory, 'all-icons.ts');
console.log('Writing all-icons file');
fs.writeFileSync(allIconsFilePath, allIconsFileContents, { encoding: 'utf-8' });
console.log('Finished writing all-icons file');
