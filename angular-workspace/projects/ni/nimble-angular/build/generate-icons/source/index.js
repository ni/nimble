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
let moduleInfo = [];
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
        // console.log(directiveFilePath);

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

        moduleInfo.push({name: moduleName, path: moduleFilePath});
    }
}
console.log(`Finshed writing ${moduleInfo.length} icon directive and module files`);
const allIconsDirectory = path.resolve(iconsDirectory, 'all-icons');
fs.mkdirSync(allIconsDirectory);

const allIconsModuleFilePath = path.resolve(allIconsDirectory, 'all-icons.module.ts');
let allIconsModuleFileContents = `import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';`

for (let module of moduleInfo) {
    const relativeModulePath = path.relative(allIconsDirectory, module.path).replaceAll('\\', '/');
    allIconsModuleFileContents += `\nimport { ${module.name} } from '${relativeModulePath}';`
}

const moduleNames = moduleInfo.map(module => module.name).join(',\n        ');

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
