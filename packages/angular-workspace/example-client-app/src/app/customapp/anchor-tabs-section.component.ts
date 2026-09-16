/* eslint-disable no-alert */
import { Component } from '@angular/core';

@Component({
    selector: 'example-anchor-tabs-section',
    template: `
        <example-sub-container label="Tabs - Anchor">
            <nimble-anchor-tabs activeid="a-tab-1">
                <nimble-anchor-tab id="a-tab-1" href="https://nimble.ni.dev">Tab 1</nimble-anchor-tab>
                <nimble-anchor-tab id="a-tab-2" href="https://ni.com">Tab 2</nimble-anchor-tab>
                <nimble-anchor-tab disabled id="a-tab-3" href="https://google.com">Tab 3 (Disabled)</nimble-anchor-tab>
                <nimble-tabs-toolbar>
                    <nimble-button (click)="onTabToolbarButtonClick()">Toolbar button</nimble-button>
                </nimble-tabs-toolbar>
            </nimble-anchor-tabs>
        </example-sub-container>
    `,
    standalone: false
})
export class AnchorTabsSectionComponent {
    public onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }
}
