import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-section',
    template: `
        <example-fv-accordion-item-section></example-fv-accordion-item-section>
        <example-ok-fv-search-input-section></example-ok-fv-search-input-section>
    `,
    standalone: false
})
export class FvSectionComponent {}
