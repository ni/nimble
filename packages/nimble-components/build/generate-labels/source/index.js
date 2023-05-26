/**
 * Build script for generating Nimble components for labels.
 *
 * Iterates through labels.json, and generates source files.
 */
import { spinalCase } from '@microsoft/fast-web-utilities';
import labels from '../../../labels.json';

const fs = require('fs');
const path = require('path');

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-components/build/generate-labels\n`;

const labelsDirectory = path.resolve(__dirname, '../../../src/labels');

if (fs.existsSync(labelsDirectory)) {
    console.log(`Deleting existing labels directory "${labelsDirectory}"`);
    fs.rmSync(labelsDirectory, { recursive: true });
    console.log('Finished deleting existing labels directory');
}
console.log(`Creating labels directory "${labelsDirectory}"`);
fs.mkdirSync(labelsDirectory);
console.log('Finished creating labels directory');

console.log('Writing label files');
let labelsFileContents = `${generatedFilePrefix}
import { DesignToken } from '@microsoft/fast-foundation';
`;
let labelNamesFileContents = `${generatedFilePrefix}
import type * as LabelsNamespace from '.';

type LabelName = keyof typeof LabelsNamespace;

export const labelNames: { readonly [key in LabelName]: string } = {`;
let labelValuesFileContents = `${generatedFilePrefix}
import type * as LabelsNamespace from '.';

type LabelName = keyof typeof LabelsNamespace;

export const labelValues: { readonly [key in LabelName]: string } = {`;
let themeProviderBaseFileContents = `${generatedFilePrefix}
import { attr } from '@microsoft/fast-element';
import { FoundationElement } from '@microsoft/fast-foundation';
import * as labels from '.';

/**
 * Base class of ThemeProvider that declares string resources / labels
 * @internal
 */
export class ThemeProviderBase extends FoundationElement {`;
let themeProviderBaseProperties = '';
let themeProviderBaseMethods = '';
const labelNames = Object.keys(labels);
let labelCount = 0;
for (const key of labelNames) {
    const labelName = key; // e.g. "labelNumberFieldIncrement"
    const tokenName = spinalCase(labelName); // e.g. "label-number-field-increment";
    const labelValue = labels[key];

    const designTokenContents = `
export const ${labelName} = DesignToken.create<string>({
    name: '${tokenName}',
    cssCustomPropertyName: null
}).withDefault('${labelValue}');
`;

    let labelNameContents = `
    ${labelName}: '${tokenName}'`;
    labelCount += 1;
    if (labelCount < labelNames.length) {
        labelNameContents = labelNameContents.concat(',');
    }
    let labelValueContents = `
    ${labelName}: '${labelValue}'`;
    if (labelCount < labelNames.length) {
        labelValueContents = labelValueContents.concat(',');
    }

    themeProviderBaseProperties = themeProviderBaseProperties.concat(`
    @attr({
        attribute: '${tokenName}',
        mode: 'fromView'
    })
    public ${labelName} = '${labelValue}';
`);
    themeProviderBaseMethods = themeProviderBaseMethods.concat(`
    public ${labelName}Changed(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        if (next !== undefined && next !== null) {
            labels.${labelName}.setValueFor(this, next);
        } else {
            labels.${labelName}.deleteValueFor(this);
        }
    }
`);
    labelsFileContents = labelsFileContents.concat(designTokenContents);
    labelNamesFileContents = labelNamesFileContents.concat(labelNameContents);
    labelValuesFileContents = labelValuesFileContents.concat(labelValueContents);
}
labelNamesFileContents = labelNamesFileContents.concat('\n};\n');
labelValuesFileContents = labelValuesFileContents.concat('\n};\n');
themeProviderBaseFileContents = themeProviderBaseFileContents.concat(themeProviderBaseProperties);
themeProviderBaseFileContents = themeProviderBaseFileContents.concat(themeProviderBaseMethods);
themeProviderBaseFileContents = themeProviderBaseFileContents.concat('}\n');

const labelTokensFilePath = path.resolve(labelsDirectory, 'index.ts');
console.log('Writing index.ts file');
fs.writeFileSync(labelTokensFilePath, labelsFileContents, { encoding: 'utf-8' });
console.log('Finished writing index.ts file');
const labelNamesFilePath = path.resolve(labelsDirectory, 'label-names.ts');
console.log('Writing label-names.ts file');
fs.writeFileSync(labelNamesFilePath, labelNamesFileContents, { encoding: 'utf-8' });
console.log('Finished writing label-names.ts file');
const labelValuesFilePath = path.resolve(labelsDirectory, 'label-values.ts');
console.log('Writing label-values.ts file');
fs.writeFileSync(labelValuesFilePath, labelValuesFileContents, { encoding: 'utf-8' });
console.log('Finished writing label-values.ts file');
const themeProviderBaseFilePath = path.resolve(labelsDirectory, 'theme-provider-base.ts');
console.log('Writing theme-provider-base.ts file');
fs.writeFileSync(themeProviderBaseFilePath, themeProviderBaseFileContents, { encoding: 'utf-8' });
console.log('Finished writing theme-provider-base.ts file');