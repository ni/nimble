import { Component } from '@angular/core';

@Component({
    selector: 'example-number-field-section',
    template: `
        <example-sub-container label="Number Field">
            <nimble-number-field appearance="underline" placeholder="Number Field" value="42">Underline Number Field</nimble-number-field>
            <nimble-number-field appearance="outline" placeholder="Number Field" value="42">Outline Number Field</nimble-number-field>
            <nimble-number-field appearance="block" placeholder="Number Field" value="42">Block Number Field</nimble-number-field>
        </example-sub-container>
    `,
    standalone: false
})
export class NumberFieldSectionComponent {}
