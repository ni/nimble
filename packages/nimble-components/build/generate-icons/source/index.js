/**
 * Build script for generating Nimble components for icons.
 *
 * Iterates through icons provided by nimble-tokens, and generates a Nimble component for each in
 * src/icons. Also generates an all-icons barrel file.
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

// Optional per-icon layer color mapping configuration (multi-color support)
let iconColorLayerMapping = {};
try {
    // Support running from both source/ (before bundling) and dist/ (after bundling)
    const candidatePaths = [
        path.resolve(__dirname, 'icon-color-layers.json'), // dist or source if copied
        path.resolve(__dirname, '../source/icon-color-layers.json'), // dist -> source
        path.resolve(__dirname, '../icon-color-layers.json') // source -> parent
    ];
    let mappingPathUsed;
    for (const p of candidatePaths) {
        if (fs.existsSync(p)) {
            mappingPathUsed = p;
            break;
        }
    }
    if (mappingPathUsed) {
        iconColorLayerMapping = JSON.parse(
            fs.readFileSync(mappingPathUsed, { encoding: 'utf-8' })
        );
        console.log(
            `[generate-icons] loaded multi-color mapping from: ${mappingPathUsed}`
        );
    } else {
        console.log(
            '[generate-icons] no icon-color-layers.json found in expected locations; proceeding without multi-color mappings.'
        );
    }
} catch (err) {
    console.warn(
        '[generate-icons] error loading icon-color-layers.json. Proceeding without multi-color mapping.',
        err
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
    const elementBaseName = `icon-${spinalCase(iconName)}`; // e.g. "icon-arrow-expander-left-icon"
    const elementName = `nimble-${elementBaseName}`;
    const className = `Icon${pascalCase(iconName)}`; // e.g. "IconArrowExpanderLeft"
    const tagName = `icon${pascalCase(iconName)}Tag`; // e.g. "iconArrowExpanderLeftTag"

    const layerTokens = iconColorLayerMapping[iconName];
    const hasLayers = Array.isArray(layerTokens) && layerTokens.length > 0;
    const uniqueLayerTokens = hasLayers ? [...new Set(layerTokens)] : [];

    let layerTokenImport = '';
    if (hasLayers) {
        // Import the design tokens so we can reference their css custom properties
        layerTokenImport = `import { ${uniqueLayerTokens.join(
            ', '
        )} } from '../theme-provider/design-tokens';\n`;
    }

    if (hasLayers) {
        console.log(
            `[generate-icons] multi-color: ${iconName} -> ${layerTokens.join(', ')}`
        );
    } else if (iconColorLayerMapping[iconName]) {
        console.warn(
            `[generate-icons] multi-color mapping entry for ${iconName} exists but has no tokens.`
        );
    }

    const multiColorSetup = hasLayers
        ? `        // Multi-color icon: set data flag & layer CSS custom properties\n        this.setAttribute('data-multicolor', '');\n${layerTokens
            .map(
                (tokenName, idx) => `        this.style.setProperty('--ni-nimble-icon-layer-${idx + 1}-color', 'var(' + ${tokenName}.cssCustomProperty + ')');`
            )
            .join('\n')}`
        : '';

    const componentFileContents = `${generatedFilePrefix}
import { ${svgName} } from '@ni/nimble-tokens/dist/icons/js';
import { Icon, registerIcon } from '../icon-base';
${layerTokenImport}

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
${multiColorSetup ? `${multiColorSetup}\n` : ''}
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
console.log(`Finshed writing ${fileCount} icon component files`);

const allIconsFilePath = path.resolve(iconsDirectory, 'all-icons.ts');
console.log('Writing all-icons file');
fs.writeFileSync(allIconsFilePath, allIconsFileContents, { encoding: 'utf-8' });
console.log('Finished writing all-icons file');
