import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-section',
    template: `
        <example-fv-accordion-item-section></example-fv-accordion-item-section>
        <example-fv-card-section></example-fv-card-section>
        <example-fv-chip-selector-section></example-fv-chip-selector-section>
        <example-fv-context-help-section></example-fv-context-help-section>
        <example-fv-master-detail-list-section></example-fv-master-detail-list-section>
        <example-fv-search-input-section></example-fv-search-input-section>
        <example-fv-split-button-section></example-fv-split-button-section>
        <example-fv-split-button-anchor-section></example-fv-split-button-anchor-section>
        <example-fv-summary-panel-section></example-fv-summary-panel-section>
    `,
    standalone: false
})
export class FvSectionComponent {}
