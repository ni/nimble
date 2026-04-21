import { Component } from '@angular/core';

@Component({
    selector: 'example-ex-button-section',
    template: `
        <example-sub-container label="Button (Ok)">
            <ok-ex-button>Ok</ok-ex-button>
        </example-sub-container>
    `,
    standalone: false
})
export class ExButtonSectionComponent {}
