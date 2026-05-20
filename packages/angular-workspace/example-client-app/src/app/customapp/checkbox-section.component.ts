import { Component } from '@angular/core';

@Component({
    selector: 'example-checkbox-section',
    template: `
        <example-sub-container label="Checkbox">
            <nimble-checkbox>Checkbox label</nimble-checkbox>
            <nimble-checkbox>Checkbox label</nimble-checkbox>
            <nimble-checkbox>Checkbox label</nimble-checkbox>
        </example-sub-container>
    `,
    standalone: false
})
export class CheckboxSectionComponent {}
