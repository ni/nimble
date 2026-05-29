import { Component } from '@angular/core';

@Component({
    selector: 'example-buttons-section',
    template: `
        <example-sub-container label="Buttons">
            <nimble-button appearance="outline">Outline Button</nimble-button>
            <nimble-button appearance="block">Block Button</nimble-button>
            <nimble-button appearance="ghost">Ghost Button</nimble-button>
        </example-sub-container>
    `,
    standalone: false
})
export class ButtonsSectionComponent {}
