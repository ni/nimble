/**
 * Build script for generating Nimble components for icons.
 *
 * Iterates through icons provided by nimble-tokens, and generates a Nimble component for each in
 * src/icons. Also generates an all-icons barrel file and the icons.mdx Storybook file.
 */
import { pascalCase, spinalCase } from '@microsoft/fast-web-utilities';
import * as icons from '@ni/nimble-tokens/dist/icons/js';
import { iconMetadata } from '../../../dist/esm/icon-base/icon-metadata';

const fs = require('fs');
const path = require('path');

const trimSizeFromName = text => {
    // Remove dimensions from icon name, e.g. "add16X16" -> "add"
    return text.replace(/\d+X\d+$/, '');
};

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-components/build/generate-icons\n`;

const mdxFilePrefix = `import { Meta, Title, IconItem } from '@storybook/blocks';
import * as iconStories from '../icon-base/tests/icons.stories';

<Meta of={iconStories} />
<Title of={iconStories} />`;

let mdxTable = `| Icon | Synonyms |
| ---- | -------- |
`;

let mdxImportStatements = '';

const iconsDirectory = path.resolve(__dirname, '../../../src/icons');

if (fs.existsSync(iconsDirectory)) {
    console.log(`Deleting existing icons directory "${iconsDirectory}"`);
    fs.rmSync(iconsDirectory, { recursive: true });
    console.log('Finished deleting existing icons directory');
}
console.log(`Creating icons directory "${iconsDirectory}"`);
fs.mkdirSync(iconsDirectory);
fs.mkdirSync(path.resolve(iconsDirectory, 'tests'));
console.log('Finished creating icons directory');

console.log('Writing icon component files');
let allIconsFileContents = `${generatedFilePrefix}\n`;
let fileCount = 0;

for (const key of Object.keys(icons)) {
    const svgName = key; // e.g. "arrowExpanderLeft16X16"
    const iconName = trimSizeFromName(key); // e.g. "arrowExpanderLeft"
    const fileName = spinalCase(iconName); // e.g. "arrow-expander-left";
    const elementBaseName = `icon-${spinalCase(iconName)}`; // e.g. "icon-arrow-expander-left-icon"
    const elementName = `nimble-${elementBaseName}`;
    const className = `Icon${pascalCase(iconName)}`; // e.g. "IconArrowExpanderLeft"
    const tagName = `icon${pascalCase(iconName)}Tag`; // e.g. "iconArrowExpanderLeftTag"

    const iconSynonyms = iconMetadata[className];

    const componentFileContents = `${generatedFilePrefix}
import { ${svgName} } from '@ni/nimble-tokens/dist/icons/js';
import { DesignSystem } from '@microsoft/fast-foundation';
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
export const ${tagName} = DesignSystem.tagFor(${className});
`;

    const filePath = path.resolve(iconsDirectory, `${fileName}.ts`);
    fs.writeFileSync(filePath, componentFileContents, { encoding: 'utf-8' });
    fileCount += 1;

    allIconsFileContents += `export { ${className} } from './${fileName}';\n`;

    mdxImportStatements += `import { ${tagName} } from './${fileName}';\n`;
    mdxTable += `| <IconItem name="${fileName}"><${elementName} /></IconItem> | ${iconSynonyms?.tags.join(', ')} |\n`;
}
console.log(`Finshed writing ${fileCount} icon component files`);

const allIconsFilePath = path.resolve(iconsDirectory, 'all-icons.ts');
console.log('Writing all-icons file');
fs.writeFileSync(allIconsFilePath, allIconsFileContents, { encoding: 'utf-8' });
console.log('Finished writing all-icons file');

const mdxFileContents = `
${mdxFilePrefix}\n
${mdxImportStatements}
${mdxTable}`;

const iconsMDXFilePath = path.resolve(iconsDirectory, 'tests/icons.mdx');
console.log('Writing icons.mdx file');
fs.writeFileSync(iconsMDXFilePath, mdxFileContents, { encoding: 'utf-8' });
console.log('Finished writing icons.mdx file');
