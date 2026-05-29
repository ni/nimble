import { Component } from '@angular/core';

@Component({
    selector: 'example-menu-section',
    template: `
        <example-sub-container label="Menu">
            <nimble-menu>
                <header>Header 1</header>
                <nimble-menu-item>
                    Item 1
                    <nimble-icon-add slot="start"></nimble-icon-add>
                </nimble-menu-item>
                <nimble-menu-item>Item 2</nimble-menu-item>
                <hr>
                <header>Header 2</header>
                <nimble-menu-item>Item 4</nimble-menu-item>
                <nimble-anchor-menu-item nimbleRouterLink="/customapp">Item 5 (link)</nimble-anchor-menu-item>
            </nimble-menu>
        </example-sub-container>
    `,
    standalone: false
})
export class MenuSectionComponent {}
