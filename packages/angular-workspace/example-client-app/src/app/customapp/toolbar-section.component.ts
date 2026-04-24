import { Component } from '@angular/core';

@Component({
    selector: 'example-toolbar-section',
    template: `
        <example-sub-container label="Toolbar">
            <nimble-toolbar>
                <nimble-button slot="start" appearance="outline">First button</nimble-button>
                <nimble-button slot="start" appearance="outline">Second button</nimble-button>
                <nimble-button>Middle button</nimble-button>
                <nimble-button slot="end" appearance="outline">Last button</nimble-button>
            </nimble-toolbar>
        </example-sub-container>
    `,
    styles: [`
        @use '@ni/nimble-angular/styles/tokens' as *;
        nimble-toolbar::part(positioning-region) {
            background-color: $ni-nimble-section-background-color;
        }
    `],
    standalone: false
})
export class ToolbarSectionComponent {}
