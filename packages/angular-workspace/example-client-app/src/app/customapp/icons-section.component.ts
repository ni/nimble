import { Component } from '@angular/core';

@Component({
    selector: 'example-icons-section',
    template: `
        <example-sub-container label="Icons (Spright)">
            <spright-icon-work-item-calendar-week></spright-icon-work-item-calendar-week>
        </example-sub-container>
    `,
    standalone: false
})
export class IconsSectionComponent {}
