/**
 * Build script for generating nimble-angular integration for Nimble icons.
 *
 * Iterates through icons provided by nimble-tokens, and generates an Angular directive and module
 * files for each in src/directives/icons.
 */

import * as icons from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

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

const getRelativeFilePath = (from, to) => {
    return path.relative(from, to)
        .replace(/\\/g, '/') // Replace backslashes with forward slashes
        .replace(/^\w/, firstChar => `./${firstChar}`); // Prefix "./" to relative paths that don't navigate up
};

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-angular/build/generate-icons\n`;

const packageDirectory = path.resolve(__dirname, '../../../');
const iconsDirectory = path.resolve(packageDirectory, 'src/directives/icons');
console.log(iconsDirectory);

if (fs.existsSync(iconsDirectory)) {
    console.log(`Deleting existing icons directory "${iconsDirectory}"`);
    fs.rmSync(iconsDirectory, { recursive: true });
    console.log('Finished deleting existing icons directory');
}
console.log(`Creating icons directory "${iconsDirectory}"`);
fs.mkdirSync(iconsDirectory);
console.log('Finished creating icons directory');

console.log('Writing icon directive and module files');
const directiveAndModulePaths = [];
for (const key of Object.keys(icons)) {
    const iconName = trimSizeFromName(key); // "arrowExpanderLeft"
    const directoryName = camelToKebabCase(iconName); // e.g. "arrow-expander-left"
    const elementName = `nimble-${camelToKebabCase(iconName)}-icon`; // e.g. "nimble-arrow-expander-left-icon"
    const className = `${camelToPascalCase(iconName)}Icon`; // e.g. "ArrowExpanderLeftIcon"
    const directiveName = `Nimble${className}Directive`; // e.g. "NimbleArrowExpanderLeftIconDirective"
    const iconDirectory = path.resolve(iconsDirectory, directoryName);
    fs.mkdirSync(iconDirectory);

    const directiveFileContents = `${generatedFilePrefix}
import { Directive } from '@angular/core';
import type { ${className} } from '@ni/nimble-components/dist/esm/icons/${directoryName}';

export type { ${className} };

/**
 * Directive to provide Angular integration for the ${iconName} icon element.
 */
@Directive({
    selector: '${elementName}'
})
export class ${directiveName} {
}
`;
    const directiveFileName = `${elementName}.directive`;
    const directiveFilePath = path.resolve(iconDirectory, directiveFileName);
    fs.writeFileSync(`${directiveFilePath}.ts`, directiveFileContents, { encoding: 'utf-8' });

    const moduleName = `Nimble${className}Module`; // e.g. "NimbleArrowExpanderLeftIconModule"
    const moduleFileContents = `${generatedFilePrefix}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ${directiveName} } from './${directiveFileName}';

import '@ni/nimble-components/dist/esm/icons/${directoryName}';

@NgModule({
    declarations: [${directiveName}],
    imports: [CommonModule],
    exports: [${directiveName}]
})
export class ${moduleName} { }
`;

    const moduleFilePath = path.resolve(iconDirectory, `${elementName}.module`);
    fs.writeFileSync(`${moduleFilePath}.ts`, moduleFileContents, { encoding: 'utf-8' });

    directiveAndModulePaths.push({
        directivePath: directiveFilePath,
        modulePath: moduleFilePath
    });
}
console.log(`Finshed writing ${directiveAndModulePaths.length} icon directive and module files`);

// Write a new public-api.ts file including the icon exports.
// This can be removed once barrel files can be used in this project (after enabling Ivy).
const sourceDirectory = path.resolve(packageDirectory, 'src');
let publicApiIconContent = '\n// Icons\n';
for (const paths of directiveAndModulePaths) {
    publicApiIconContent += `export * from '${getRelativeFilePath(sourceDirectory, paths.directivePath)}';
export * from '${getRelativeFilePath(sourceDirectory, paths.modulePath)}';\n`;
}
const publicApiTemplateFilePath = path.resolve(sourceDirectory, 'public-api.template.ts');
const publicApiTemplateFileContents = fs.readFileSync(publicApiTemplateFilePath, { encoding: 'utf-8' });
const iconExportTemplateSearchRegex = /^.*{{INSERT_ICONS_EXPORTS_HERE}}$/m;
let publicApiFileContents = `${generatedFilePrefix}\n`;
if (!iconExportTemplateSearchRegex.test(publicApiTemplateFileContents)) {
    throw new Error('public-api template file does not included expected insertion point for icon exports');
}
publicApiFileContents += publicApiTemplateFileContents.replace(iconExportTemplateSearchRegex, publicApiIconContent);
const publicApiFilePath = path.resolve(sourceDirectory, 'public-api');

console.log('Writing public API file');
fs.writeFileSync(`${publicApiFilePath}.ts`, publicApiFileContents, { encoding: 'utf-8' });
console.log('Finished writing public API file');
