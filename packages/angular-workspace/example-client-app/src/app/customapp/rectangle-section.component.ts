import { Component } from '@angular/core';

@Component({
    selector: 'example-rectangle-section',
    template: `
        <example-sub-container label="Rectangle (Spright)">
            <spright-rectangle>Spright!</spright-rectangle>
        </example-sub-container>
    `,
    standalone: false
})
export class RectangleSectionComponent {}
