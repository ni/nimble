/**
 * Build script for generating React wrappers for Nimble icon components.
 */
import { pascalCase, spinalCase } from '@ni/fast-web-utilities';
import * as singleIcons from '@ni/nimble-tokens/dist/icons/js/single';
import * as multiColorIconsData from '@ni/nimble-tokens/dist/icons/js/multicolor';
import { multiColorIcons } from '@ni/nimble-components/dist/esm/icon-base/icon-multicolor-metadata';

const icons = { ...singleIcons, ...multiColorIconsData };

const fs = require('fs');
const path = require('path');

const trimSizeFromName = text => {
    // Remove dimensions from icon name, e.g. "add16X16" -> "add"
    return text.replace(/\d+X\d+$/, '');
};

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-react/build/generate-icons\n`;

// Multi-color icons use a different import path (icons-multicolor vs icons)
const multiColorIconSet = new Set(multiColorIcons);

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

    // Determine if this is a multi-color icon and set the appropriate import path
    const isMultiColor = multiColorIconSet.has(fileName);
    const iconSubfolder = isMultiColor ? 'icons-multicolor' : 'icons';

    const className = `Icon${pascalCase(iconName)}`; // e.g. "IconArrowExpanderLeft"

    fileCount += 1;

    const iconReactWrapperContent = `${generatedFilePrefix}
import { ${className} } from '@ni/nimble-components/dist/esm/${iconSubfolder}/${fileName}';
import { wrap } from '../utilities/react-wrapper';

export { type ${className} };
export const Nimble${className} = wrap(${className});`;

    const outputPath = path.resolve(iconsDirectory, `${fileName}.ts`);
    fs.writeFileSync(outputPath, iconReactWrapperContent, {
        encoding: 'utf-8'
    });
}
console.log(`Finshed writing ${fileCount} icon react wrapper files`);
