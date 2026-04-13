import { Component } from '@angular/core';

@Component({
    selector: 'example-ok-button-section',
    template: `
        <example-sub-container label="Button (Ok)">
            <ok-button>Ok</ok-button>
        </example-sub-container>
    `,
    standalone: false
})
export class OkButtonSectionComponent {}
