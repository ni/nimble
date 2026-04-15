import { Component } from '@angular/core';

@Component({
    selector: 'example-breadcrumb-section',
    template: `
        <example-sub-container label="Breadcrumb">
            <nimble-breadcrumb>
                <nimble-breadcrumb-item href="#">Page 1</nimble-breadcrumb-item>
                <nimble-breadcrumb-item nimbleRouterLink="/customapp">Page 2</nimble-breadcrumb-item>
                <nimble-breadcrumb-item>Current Page (No Link)</nimble-breadcrumb-item>
            </nimble-breadcrumb>
        </example-sub-container>
    `,
    standalone: false
})
export class BreadcrumbSectionComponent {}
