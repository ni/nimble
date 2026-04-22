import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-search-input-section',
    template: `
        <example-sub-container label="Fv Search Input (Ok)">
            <ok-fv-search-input placeholder="Search assets" value="PXI"></ok-fv-search-input>
        </example-sub-container>
    `,
    standalone: false
})
export class FvSearchInputSectionComponent {}