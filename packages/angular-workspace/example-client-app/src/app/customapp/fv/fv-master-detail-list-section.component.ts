import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-master-detail-list-section',
    template: `
        <example-sub-container label="Fv Master Detail List (Ok)">
            <ok-fv-master-detail-list placeholder="Filter devices...">
                <ok-fv-master-detail-list-item
                    title-text="NI-DAQ-001"
                    subtitle="USB-6001 · Lab A"
                    value="daq-001"
                    status-color="#169c44"
                    status-label="Connected"
                    selected>
                </ok-fv-master-detail-list-item>
                <ok-fv-master-detail-list-item
                    title-text="NI-SCOPE-002"
                    subtitle="PXIe-5162 · Lab B"
                    value="scope-002"
                    status-color="#169c44"
                    status-label="Connected">
                </ok-fv-master-detail-list-item>
                <ok-fv-master-detail-list-item
                    title-text="NI-SWITCH-005"
                    subtitle="PXI-2527 · Rack 3"
                    value="switch-005"
                    compact>
                    <span slot="status" aria-label="Pending changes">!</span>
                </ok-fv-master-detail-list-item>
            </ok-fv-master-detail-list>
        </example-sub-container>
    `,
    styles: [`
        ok-fv-master-detail-list { inline-size: 360px; min-block-size: 360px; }
    `],
    standalone: false
})
export class FvMasterDetailListSectionComponent {}