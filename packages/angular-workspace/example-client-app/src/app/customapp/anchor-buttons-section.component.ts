import { Component } from '@angular/core';

@Component({
    selector: 'example-anchor-buttons-section',
    template: `
        <example-sub-container label="Buttons - Anchor">
            <nimble-anchor-button nimbleRouterLink="/customapp" appearance="outline">Outline Anchor Button</nimble-anchor-button>
            <nimble-anchor-button nimbleRouterLink="/customapp" appearance="block">Block Anchor Button</nimble-anchor-button>
            <nimble-anchor-button nimbleRouterLink="/customapp" appearance="ghost">Ghost Anchor Button</nimble-anchor-button>
        </example-sub-container>
    `,
    standalone: false
})
export class AnchorButtonsSectionComponent {}
