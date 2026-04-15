import { Component } from '@angular/core';

@Component({
    selector: 'example-text-field-section',
    template: `
        <example-sub-container label="Text Field">
            <nimble-text-field appearance="underline" placeholder="Text Field" value="Here is text!">Underline Text Field</nimble-text-field>
            <nimble-text-field appearance="outline" placeholder="Text Field" value="Here is text!">Outline Text Field</nimble-text-field>
            <nimble-text-field appearance="block" placeholder="Text Field" value="Here is text!">Block Text Field</nimble-text-field>
        </example-sub-container>
    `,
    standalone: false
})
export class TextFieldSectionComponent {}
