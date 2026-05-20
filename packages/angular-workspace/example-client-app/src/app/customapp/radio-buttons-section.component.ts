import { Component } from '@angular/core';

@Component({
    selector: 'example-radio-buttons-section',
    template: `
        <example-sub-container label="Radio Buttons">
            <nimble-radio-group>
                <span slot="label">Fruit</span>
                <nimble-radio name="fruit" value="apple" [(ngModel)]="selectedRadio">Apple</nimble-radio>
                <nimble-radio name="fruit" value="banana" [(ngModel)]="selectedRadio">Banana</nimble-radio>
                <nimble-radio name="fruit" value="mango" [(ngModel)]="selectedRadio">Mango</nimble-radio>
            </nimble-radio-group>
            <nimble-text-field [(ngModel)]="selectedRadio">Selected value</nimble-text-field>
        </example-sub-container>
    `,
    standalone: false
})
export class RadioButtonsSectionComponent {
    public selectedRadio = 'mango';
}
