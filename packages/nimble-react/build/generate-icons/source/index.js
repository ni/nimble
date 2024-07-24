/**
 * Build script for generating React wrappers for Nimble icon components.
 */
import { pascalCase, spinalCase } from '@microsoft/fast-web-utilities';
import * as icons from '@ni/nimble-tokens/dist/icons/js';

const fs = require('fs');
const path = require('path');

const trimSizeFromName = text => {
    // Remove dimensions from icon name, e.g. "add16X16" -> "add"
    return text.replace(/\d+X\d+$/, '');
};

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in storybook/build/generate-icons\n`;

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
    const className = `Icon${pascalCase(iconName)}`; // e.g. "IconArrowExpanderLeft"

    fileCount += 1;

    const iconReactWrapperContent = `${generatedFilePrefix}
import { ${className} } from '../../../nimble-components/src/icons/${fileName}';
import { wrap } from '../utilities/react-wrapper';

export const Nimble${className} = wrap(${className});`;

    const outputPath = path.resolve(iconsDirectory, `${fileName}.react.tsx`);
    fs.writeFileSync(outputPath, iconReactWrapperContent, {
        encoding: 'utf-8'
    });
}
console.log(`Finshed writing ${fileCount} icon react wrapper files`);
