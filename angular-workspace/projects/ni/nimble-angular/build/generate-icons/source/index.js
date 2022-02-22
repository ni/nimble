import * as icons from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';

const fs = require('fs');
const path = require('path');

const trimSizeFromName = text => {
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
        .replaceAll('\\', '/') // replace backslashes with forward slashes
        .replace(/^\w/, firstChar => `./${firstChar}`); // Add "./" to relative paths that don't navigate up
};

const iconsDirectory = path.resolve(__dirname, '../../../src/directives/icons');
console.log(iconsDirectory);

if (fs.existsSync(iconsDirectory)) {
    console.log('Deleting existing icons directory');
    fs.rmSync(iconsDirectory, { recursive: true });
    console.log('Finished deleting existing icons directory');
}
console.log('Creating icons directory');
fs.mkdirSync(iconsDirectory);
console.log('Finished creating icons directory');

console.log('Writing icon directive and module files');
let moduleNamesAndPaths = [];
let directivePaths = [];
for (const key in icons) {
    if (Object.prototype.hasOwnProperty.call(icons, key)) {
        const iconName = trimSizeFromName(key);
        const elementName = `nimble-${camelToKebabCase(iconName)}-icon`;
        const className = `${camelToPascalCase(iconName)}Icon`;
        const directiveName = `Nimble${className}Directive`;
        const iconDirectory = path.resolve(iconsDirectory, `${iconName}`);
        fs.mkdirSync(iconDirectory);

        const directiveFileContents = `import { Directive } from '@angular/core';
import type { ${className} } from '@ni/nimble-components/dist/esm/icons2/all-icons';

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
        directivePaths.push(directiveFilePath);

        const moduleName = `Nimble${className}Module`;
        const moduleFileContents = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ${directiveName} } from './${directiveFileName}';

import '@ni/nimble-components/dist/esm/icons2/${iconName}';

@NgModule({
    declarations: [${directiveName}],
    imports: [CommonModule],
    exports: [${directiveName}]
})
export class ${moduleName} { }
`;
        
        const moduleFilePath = path.resolve(iconDirectory, `${elementName}.module`);
        fs.writeFileSync(`${moduleFilePath}.ts`, moduleFileContents, { encoding: 'utf-8' });

        moduleNamesAndPaths.push({name: moduleName, path: moduleFilePath});
    }
}
console.log(`Finshed writing ${moduleNamesAndPaths.length} icon directive and module files`);
const allIconsDirectory = path.resolve(iconsDirectory, 'all-icons');
fs.mkdirSync(allIconsDirectory);

const allIconsModuleFilePath = path.resolve(allIconsDirectory, 'all-icons.module.ts');
let allIconsModuleFileContents = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';`

for (let module of moduleNamesAndPaths) {
    const relativeModulePath = getRelativeFilePath(allIconsDirectory, module.path);
    allIconsModuleFileContents += `\nimport { ${module.name} } from '${relativeModulePath}';`
}

const moduleNames = moduleNamesAndPaths.map(module => module.name).join(',\n        ');

allIconsModuleFileContents += `\n\n@NgModule({
    imports: [
        CommonModule,
        ${moduleNames}
    ],
    exports: [
        ${moduleNames}
    ]
})
export class NimbleAllIconsModule { }`;

console.log('Writing all-icons module file');
fs.writeFileSync(`${allIconsModuleFilePath}`, allIconsModuleFileContents, { encoding: 'utf-8' });
console.log('Finished writing all-icons module file');

let barrelFileContents = '';
for (let directivePath of directivePaths) {
    barrelFileContents += `export * from '${getRelativeFilePath(iconsDirectory, directivePath)}';\n`;
}
for (let module of moduleNamesAndPaths) {
    barrelFileContents += `export * from '${getRelativeFilePath(iconsDirectory, module.path)}';\n`;
}

const barrelFilePath = path.resolve(iconsDirectory, 'index');

console.log('Writing barrel file');
fs.writeFileSync(barrelFilePath + '.ts', barrelFileContents, { encoding: 'utf-8' });
console.log('Finished writing barrel file');
