import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-chip-selector-section',
    template: `
        <example-sub-container label="Fv Chip Selector (Ok)">
            <ok-fv-chip-selector
                label="Selected assets"
                options="PXI-1, PXI-2, DAQ-1, DMM-1"
                i18n-options
                selectedValues="PXI-1, DMM-1"
                i18n-selectedValues
                placeholder="Select assets"
            ></ok-fv-chip-selector>
        </example-sub-container>
    `,
    standalone: false
})
export class FvChipSelectorSectionComponent {}