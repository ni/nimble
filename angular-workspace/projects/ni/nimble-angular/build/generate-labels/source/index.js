/**
 * Build script for generating Nimble Angular code for labels.
 *
 * Iterates through labels, and generates source files.
 */
import { spinalCase } from '@microsoft/fast-web-utilities';
import { labelValues } from '@ni/nimble-components/dist/esm/labels/label-values';

const fs = require('fs');
const path = require('path');

const generatedFilePrefix = `// AUTO-GENERATED FILE - DO NOT EDIT DIRECTLY
// See generation source in nimble-components/build/generate-labels\n`;

const packageDirectory = path.resolve(__dirname, '../../../');
const labelsDirectory = path.resolve(packageDirectory, 'src/directives/labels');
const themeProviderDirectory = path.resolve(packageDirectory, 'src/directives/theme-provider');

console.log('Writing label files');
let labelsFileContents = `${generatedFilePrefix}
import '@angular/localize/init';
/**
 * All Nimble labels (string resources) that can be localized
 */
export class NimbleLabels {`;
let labelsDirectiveFileContents = `${generatedFilePrefix}
import '@angular/localize/init';
import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { ThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';
import { NimbleLabels } from './nimble-labels';

/**
 * Directive for Nimble theme provider which will initialize all Nimble labels on this theme provider to the
 * localizable values defined in NimbleLabels
 */
@Directive({
    selector: 'nimble-theme-provider[initializeAllLabels]'
})
export class NimbleThemeProviderInitializeAllLabelsDirective {
    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<ThemeProvider>) {`;
let themeProviderBaseFileContents = `${generatedFilePrefix}
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { ThemeProvider } from '@ni/nimble-components/dist/esm/theme-provider';

/**
 * Base directive for NimbleThemeProvider which has properties for all of the labels/strings Nimble uses that can be localized
 */
@Directive()
export abstract class NimbleThemeProviderBaseDirective {
    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<ThemeProvider>) {}
`;

for (const key of Object.keys(labelValues)) {
    const labelName = key; // e.g. "labelNumberFieldIncrement"
    const tokenName = spinalCase(labelName); // e.g. "label-number-field-increment";
    const labelValue = labelValues[key];

    labelsFileContents = labelsFileContents.concat(`
    public static readonly ${labelName} = $localize\`:nimble-${tokenName}:${labelValue}\`;`);
    labelsDirectiveFileContents = labelsDirectiveFileContents.concat(`
        this.elementRef.nativeElement.${labelName} = NimbleLabels.${labelName};`);
    themeProviderBaseFileContents = themeProviderBaseFileContents.concat(`
    public get ${labelName}(): string {
        return this.elementRef.nativeElement.${labelName};
    }

    @Input() public set ${labelName}(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, '${labelName}', value);
    }
`);
}
labelsDirectiveFileContents = labelsDirectiveFileContents.concat(`
    }
}`);
labelsFileContents = labelsFileContents.concat('\n}\n');
themeProviderBaseFileContents = themeProviderBaseFileContents.concat('}\n');

const labelsFilePath = path.resolve(labelsDirectory, 'nimble-labels.ts');
console.log('Writing nimble-labels.ts file');
fs.writeFileSync(labelsFilePath, labelsFileContents, { encoding: 'utf-8' });
console.log('Finished writing nimble-labels.ts file');
const labelsDirectiveFilePath = path.resolve(labelsDirectory, 'nimble-theme-provider-initialize-all-labels.directive.ts');
console.log('Writing nimble-theme-provider-initialize-all-labels.directive.ts file');
fs.writeFileSync(labelsDirectiveFilePath, labelsDirectiveFileContents, { encoding: 'utf-8' });
console.log('Finished writing nimble-theme-provider-initialize-all-labels.directive.ts file');
const themeProviderBaseFilePath = path.resolve(themeProviderDirectory, 'nimble-theme-provider-base.directive.ts');
console.log('Writing nimble-theme-provider-base.directive.ts file');
fs.writeFileSync(themeProviderBaseFilePath, themeProviderBaseFileContents, { encoding: 'utf-8' });
console.log('Finished writing nimble-theme-provider-base.directive.ts file');