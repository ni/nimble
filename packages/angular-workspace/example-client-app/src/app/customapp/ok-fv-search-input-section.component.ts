import { Component } from '@angular/core';

@Component({
    selector: 'example-ok-fv-search-input-section',
    template: `
        <example-sub-container label="FV Search Input (Ok)">
            <ok-fv-search-input placeholder="Search assets" value="PXI"></ok-fv-search-input>
        </example-sub-container>
    `,
    standalone: false
})
export class OkFvSearchInputSectionComponent {}