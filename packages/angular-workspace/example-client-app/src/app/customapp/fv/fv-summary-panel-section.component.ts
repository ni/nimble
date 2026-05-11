import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-summary-panel-section',
    template: `
        <example-sub-container label="Fv Summary Panel (Ok)">
            <ok-fv-summary-panel showEditItemsButton editItemsButtonLabel="Configure tiles" i18n-editItemsButtonLabel>
                <ok-fv-summary-panel-tile count="7" label="open items"></ok-fv-summary-panel-tile>
                <ok-fv-summary-panel-tile count="39" label="pending reviews"></ok-fv-summary-panel-tile>
                <ok-fv-summary-panel-tile count="5" label="active alerts" selected></ok-fv-summary-panel-tile>
                <ok-fv-summary-panel-tile count="12" label="saved queries"></ok-fv-summary-panel-tile>
            </ok-fv-summary-panel>
        </example-sub-container>
    `,
    standalone: false
})
export class FvSummaryPanelSectionComponent {}