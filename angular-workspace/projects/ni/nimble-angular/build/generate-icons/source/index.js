/**
 * Build script for generating nimble-angular integration for Nimble icons.
 *
 * Iterates through icons provided by nimble-tokens, and generates an Angular directive and module
 * files for each in src/directives/icons.
 */

import { pascalCase, spinalCase } from '@microsoft/fast-web-utilities';
import * as icons from '@ni/nimble-tokens/dist/icons/js';

const fs = require('fs');
const path = require('path');

const trimSizeFromName = text => {
    // Remove dimensions from icon name, e.g. "add16X16" -> "add"
    return text.replace(/\d+X\d+$/, '');
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
    const directoryName = spinalCase(iconName); // e.g. "arrow-expander-left"
    const elementName = `nimble-icon-${spinalCase(iconName)}`; // e.g. "nimble-icon-arrow-expander-left"
    const className = `Icon${pascalCase(iconName)}`; // e.g. "IconArrowExpanderLeft"
    const directiveName = `Nimble${className}Directive`; // e.g. "NimbleIconArrowExpanderLeftDirective"
    const iconDirectory = path.resolve(iconsDirectory, directoryName);
    fs.mkdirSync(iconDirectory);

    const directiveFileContents = `${generatedFilePrefix}
import { Directive } from '@angular/core';
import type { ${className} } from '@ni/nimble-components/dist/esm/icons/${directoryName}';
import { NimbleIconBaseDirective } from '../../icon-base/nimble-icon-base.directive';

export type { ${className} };

/**
 * Directive to provide Angular integration for the ${iconName} icon element.
 */
@Directive({
    selector: '${elementName}'
})
export class ${directiveName} extends NimbleIconBaseDirective {
}
`;
    const directiveFileName = `${elementName}.directive`;
    const directiveFilePath = path.resolve(iconDirectory, directiveFileName);
    fs.writeFileSync(`${directiveFilePath}.ts`, directiveFileContents, { encoding: 'utf-8' });

    const moduleName = `Nimble${className}Module`; // e.g. "NimbleIconArrowExpanderLeftModule"
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

let barrelFileContents = `${generatedFilePrefix}\n`;
for (const paths of directiveAndModulePaths) {
    barrelFileContents += `export * from '${getRelativeFilePath(iconsDirectory, paths.directivePath)}';
export * from '${getRelativeFilePath(iconsDirectory, paths.modulePath)}';\n`;
}

const barrelFilePath = path.resolve(iconsDirectory, 'index');

console.log('Writing barrel file');
fs.writeFileSync(`${barrelFilePath}.ts`, barrelFileContents, { encoding: 'utf-8' });
console.log('Finished writing barrel file');
