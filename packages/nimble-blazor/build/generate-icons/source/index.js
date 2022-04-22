/**
 * Build script for generating nimble-blazor integration for Nimble icons.
 *
 * Iterates through icons provided by nimble-tokens, and generates a Razor component
 * file for each.
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

const generatedFilePrefix = `@* AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
 // See generation source in nimble-blazor/build/generate-icons *@\n`;

const packageDirectory = path.resolve(__dirname, '../../../');
const iconsDirectory = path.resolve(packageDirectory, 'NimbleBlazor.Components/Components/Icons');
console.log(iconsDirectory);

if (fs.existsSync(iconsDirectory)) {
    console.log(`Deleting existing icons directory "${iconsDirectory}"`);
    fs.rmSync(iconsDirectory, { recursive: true });
    console.log('Finished deleting existing icons directory');
}
console.log(`Creating icons directory "${iconsDirectory}"`);
fs.mkdirSync(iconsDirectory);
console.log('Finished creating icons directory');

console.log('Writing icon Razor component files');
for (const key of Object.keys(icons)) {
    const iconName = trimSizeFromName(key); // "arrowExpanderLeft"
    const elementName = `nimble-${camelToKebabCase(iconName)}-icon`; // e.g. "nimble-arrow-expander-left-icon"
    const className = `${camelToPascalCase(iconName)}Icon`; // e.g. "ArrowExpanderLeftIcon"
    const componentName = `Nimble${className}`; // e.g. "NimbleArrowExpanderLeftIcon"

    const directiveFileContents = `${generatedFilePrefix}
@namespace NimbleBlazor.Components
<${elementName} @attributes="AdditionalAttributes">
</${elementName}>

@code {
    /// <summary>
    /// Gets or sets a collection of additional attributes that will be applied to the created element.
    /// </summary>
    [Parameter(CaptureUnmatchedValues = true)] public IReadOnlyDictionary<string, object>? AdditionalAttributes { get; set; }
}
 `;
    const componentFileName = `${componentName}.razor`;
    const componentFilePath = path.resolve(iconsDirectory, componentFileName);
    fs.writeFileSync(componentFilePath, directiveFileContents, { encoding: 'utf-8' });
}
console.log('Finshed writing icon Razor component files');
