import { Component } from '@angular/core';

@Component({
    selector: 'example-anchor-section',
    template: `
        <example-sub-container label="Anchor">
            <div><nimble-anchor href="#" appearance="prominent">Site root</nimble-anchor></div>
            Let's try it <nimble-anchor nimbleRouterLink="/customapp" underline-visible>using nimbleRouterLink</nimble-anchor>.
        </example-sub-container>
    `,
    standalone: false
})
export class AnchorSectionComponent {}
