import { Component } from '@angular/core';

@Component({
    selector: 'example-card-section',
    template: `
        <example-sub-container label="Card">
            <nimble-card>
                <span slot="title">Title of the card</span>
                <nimble-number-field>Numeric field 1</nimble-number-field>
                <nimble-number-field>Numeric field 2</nimble-number-field>
                <nimble-select>
                    Select
                    <nimble-list-option value="1">Option 1</nimble-list-option>
                    <nimble-list-option value="2">Option 2</nimble-list-option>
                    <nimble-list-option value="3">Option 3</nimble-list-option>
                </nimble-select>
            </nimble-card>
        </example-sub-container>
    `,
    standalone: false
})
export class CardSectionComponent {}
