import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-split-button-anchor-section',
    template: `
        <example-sub-container label="Fv Split Button Anchor (Ok)">
            <ok-fv-split-button-anchor
                label="Open report"
                href="https://example.com/report"
                target="_blank"
            >
                <nimble-menu slot="menu">
                    <nimble-menu-item>Open item</nimble-menu-item>
                    <nimble-menu-item>Open in new tab</nimble-menu-item>
                    <nimble-menu-item>Copy link</nimble-menu-item>
                </nimble-menu>
            </ok-fv-split-button-anchor>
        </example-sub-container>
    `,
    standalone: false
})
export class FvSplitButtonAnchorSectionComponent {}