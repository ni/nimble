import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-accordion-item-section',
    template: `
        <example-sub-container label="Accordion Item (Ok)">
            <ok-fv-accordion-item i18n-header header="Asset details" [expanded]="true">
                Calibration assets can expose operator-facing status, location, and ownership details.
            </ok-fv-accordion-item>
            <ok-fv-accordion-item i18n-header header="Maintenance history">
                This section starts collapsed to show the default interaction state.
            </ok-fv-accordion-item>
        </example-sub-container>
    `,
    standalone: false
})
export class FvAccordionItemSectionComponent {}
