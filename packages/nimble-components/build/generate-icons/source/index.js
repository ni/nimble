/**
 * Build script for generating Nimble components for icons.
 *
 * Iterates through icons provided by nimble-tokens, and generates a Nimble component for each in
 * src/icons. Also generates an all-icons barrel file.
 */
const { pascalCase, spinalCase } = require('@ni/fast-web-utilities');
// eslint-disable-next-line import/extensions
const icons = require('@ni/nimble-tokens/dist/icons/js/index.js');

const fs = require('fs');
const path = require('path');

const trimSizeFromName = text => {
    // Remove dimensions from icon name, e.g. "add16X16" -> "add"
    return text.replace(/\d+X\d+$/, '');
};

const generatedFilePrefix = '// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY\n// See generation source in nimble-components/build/generate-icons\n';

// Multi-color support: always parse TypeScript metadata source first (regex),
// then fall back to compiled JS metadata only if the TS file is missing or
// yields zero layer entries. This ensures immediate reflection of edits
// without needing a TS build between passes.
const layerMapping = {};
try {
    const tsSourcePath = path.resolve(
        __dirname,
        '../../../src/icon-base/tests/icon-metadata.ts'
    );
    let tsParsedCount = 0;
    if (fs.existsSync(tsSourcePath)) {
        try {
            const rawTs = fs.readFileSync(tsSourcePath, 'utf-8');
            const layerEntryRegex = /(Icon[A-Za-z0-9_]+)\s*:\s*{[^}]*?layers:\s*\[(.*?)\]/gms;
            for (
                let execResult = layerEntryRegex.exec(rawTs);
                execResult;
                execResult = layerEntryRegex.exec(rawTs)
            ) {
                const metaKey = execResult[1];
                const layersRaw = execResult[2];
                const tokens = layersRaw
                    .split(/[,\n]/)
                    .map(t => t.trim().replace(/['"`]/g, ''))
                    .filter(t => t.length);
                if (tokens.length) {
                    const trimmed = metaKey.replace(/^Icon/, '');
                    const camel = trimmed.charAt(0).toLowerCase() + trimmed.slice(1);
                    layerMapping[camel] = tokens;
                    tsParsedCount += 1;
                }
            }
            console.log(
                `[generate-icons] parsed multi-color layers from TS metadata: ${tsParsedCount} icons`
            );
        } catch (tsErr) {
            console.warn(
                '[generate-icons] failed parsing TS metadata for multi-color layers',
                tsErr
            );
        }
    }
    if (tsParsedCount === 0) {
        // Fallback to compiled JS metadata if available
        const compiledPaths = [
            path.resolve(
                __dirname,
                '../../../dist/esm/icon-base/tests/icon-metadata.js'
            ),
            path.resolve(
                process.cwd(),
                'packages/nimble-components/dist/esm/icon-base/tests/icon-metadata.js'
            )
        ];
        for (const p of compiledPaths) {
            if (fs.existsSync(p)) {
                try {
                    // eslint-disable-next-line @typescript-eslint/no-var-requires, global-require, import/no-dynamic-require
                    const { iconMetadata } = require(p);
                    let count = 0;
                    for (const metaKey of Object.keys(iconMetadata)) {
                        const meta = iconMetadata[metaKey];
                        if (
                            meta
                            && Array.isArray(meta.layers)
                            && meta.layers.length
                        ) {
                            const trimmed = metaKey.replace(/^Icon/, '');
                            const camel = trimmed.charAt(0).toLowerCase()
                                + trimmed.slice(1);
                            layerMapping[camel] = meta.layers;
                            count += 1;
                        }
                    }
                    console.log(
                        `[generate-icons] loaded multi-color layers from compiled metadata: ${count} icons`
                    );
                    break;
                } catch (compiledErr) {
                    console.warn(
                        '[generate-icons] failed requiring compiled icon-metadata for layers',
                        compiledErr
                    );
                }
            }
        }
        if (Object.keys(layerMapping).length === 0) {
            console.log(
                '[generate-icons] no multi-color layers found (TS + compiled metadata missing or empty)'
            );
        }
    }
} catch (e) {
    console.warn(
        '[generate-icons] failed deriving multi-color layers from icon-metadata.',
        e
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

    const layerTokens = layerMapping[iconName];
    const hasLayers = Array.isArray(layerTokens) && layerTokens.length > 0;
    const uniqueLayerTokens = hasLayers ? [...new Set(layerTokens)] : [];

    let layerTokenImport = '';
    if (hasLayers) {
        layerTokenImport = `import { ${uniqueLayerTokens.join(
            ', '
        )} } from '../theme-provider/design-tokens';\n`;
    }

    if (hasLayers) {
        console.log(
            `[generate-icons] multi-color: ${iconName} -> ${layerTokens.join(', ')}`
        );
    } else if (layerMapping[iconName]) {
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
    import { ${svgName} } from '@ni/nimble-tokens/dist/icons/js/index.js';
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
${multiColorSetup ? `${multiColorSetup}\n` : ''}    }
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
