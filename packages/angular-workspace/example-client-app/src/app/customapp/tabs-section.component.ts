/* eslint-disable no-alert */
import { Component } from '@angular/core';

@Component({
    selector: 'example-tabs-section',
    template: `
        <example-sub-container label="Tabs">
            <nimble-tabs [(activeid)]="activeTabId">
                <nimble-tab id="tab-1">Tab 1</nimble-tab>
                <nimble-tab id="tab-2">Tab 2</nimble-tab>
                <nimble-tab id="tab-3" disabled>Tab 3 (Disabled)</nimble-tab>
                <nimble-tabs-toolbar>
                    <nimble-button (click)="onTabToolbarButtonClick()">Toolbar button</nimble-button>
                </nimble-tabs-toolbar>
                <nimble-tab-panel>
                    <div class="container-label">Tab 1 content</div>
                </nimble-tab-panel>
                <nimble-tab-panel>
                    <div class="container-label">Tab 2 content</div>
                </nimble-tab-panel>
                <nimble-tab-panel>
                    <div class="container-label">Tab 3 content</div>
                </nimble-tab-panel>
            </nimble-tabs>
            <label id="activeTabLabel">
                Active tab:
            </label>
            <nimble-select [(ngModel)]="activeTabId" aria-labelledby="activeTabLabel">
                <nimble-list-option value="tab-1">Tab 1</nimble-list-option>
                <nimble-list-option value="tab-2">Tab 2</nimble-list-option>
                <nimble-list-option value="tab-3">Tab 3</nimble-list-option>
            </nimble-select>
        </example-sub-container>
    `,
    styles: [`
        @use '@ni/nimble-angular/styles/tokens' as *;
        .container-label {
            font: $ni-nimble-group-header-font;
            color: $ni-nimble-group-header-font-color;
            padding-bottom: $ni-nimble-standard-padding;
        }
    `],
    standalone: false
})
export class TabsSectionComponent {
    public activeTabId = 'tab-1';

    public onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }
}
