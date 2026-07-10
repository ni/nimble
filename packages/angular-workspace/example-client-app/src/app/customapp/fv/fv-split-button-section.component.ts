import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-split-button-section',
    template: `
        <example-sub-container label="Fv Split Button (Ok)">
            <ok-fv-split-button label="Run action" appearance-variant="primary">
                <nimble-menu slot="menu">
                    <nimble-menu-item>Open item</nimble-menu-item>
                    <nimble-menu-item>Create copy</nimble-menu-item>
                    <nimble-menu-item>Archive selection</nimble-menu-item>
                </nimble-menu>
            </ok-fv-split-button>
        </example-sub-container>
    `,
    standalone: false
})
export class FvSplitButtonSectionComponent {}