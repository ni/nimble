import { Component } from '@angular/core';

@Component({
    selector: 'example-card-button-section',
    template: `
        <example-sub-container label="Card Button">
            <nimble-card-button>
                <span class="card-button-content">Card Button</span>
            </nimble-card-button>
            <nimble-card-button selected>
                <span class="card-button-content">Selected Card Button</span>
            </nimble-card-button>
        </example-sub-container>
    `,
    styles: [`
        @use '@ni/nimble-angular/styles/tokens' as *;
        .card-button-content {
            display: flex;
            margin: $ni-nimble-standard-padding;
        }
    `],
    standalone: false
})
export class CardButtonSectionComponent {}
