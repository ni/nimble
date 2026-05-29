import { Component } from '@angular/core';

@Component({
    selector: 'example-toggle-buttons-section',
    template: `
        <example-sub-container label="Buttons - Toggle">
            <nimble-toggle-button appearance="outline">Outline Toggle Button</nimble-toggle-button>
            <nimble-toggle-button appearance="block">Block Toggle Button</nimble-toggle-button>
            <nimble-toggle-button appearance="ghost">Ghost Toggle Button</nimble-toggle-button>
        </example-sub-container>
    `,
    standalone: false
})
export class ToggleButtonsSectionComponent {}
