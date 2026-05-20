/* eslint-disable no-alert */
import { Component } from '@angular/core';

@Component({
    selector: 'example-anchor-tabs-section',
    template: `
        <example-sub-container label="Tabs - Anchor">
            <nimble-anchor-tabs [activeid]="activeAnchorTabId">
                <nimble-anchor-tab id="a-tab-1" href="https://nimble.ni.dev">Tab 1</nimble-anchor-tab>
                <nimble-anchor-tab id="a-tab-2" href="https://ni.com">Tab 2</nimble-anchor-tab>
                <nimble-anchor-tab disabled id="a-tab-3" href="https://google.com">Tab 3 (Disabled)</nimble-anchor-tab>
                <nimble-tabs-toolbar>
                    <nimble-button (click)="onTabToolbarButtonClick()">Toolbar button</nimble-button>
                </nimble-tabs-toolbar>
            </nimble-anchor-tabs>
            <label id="activeAnchorTabLabel">
                Active tab:
            </label>
            <nimble-select [(ngModel)]="activeAnchorTabId" aria-labelledby="activeAnchorTabLabel">
                <nimble-list-option value="a-tab-1">Tab 1</nimble-list-option>
                <nimble-list-option value="a-tab-2">Tab 2</nimble-list-option>
                <nimble-list-option value="a-tab-3">Tab 3</nimble-list-option>
            </nimble-select>
        </example-sub-container>
    `,
    standalone: false
})
export class AnchorTabsSectionComponent {
    public activeAnchorTabId = 'a-tab-2';

    public onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }
}
