import { Component } from '@angular/core';

@Component({
    selector: 'example-overview-section',
    template: `
        <example-sub-container>
            Explore the components below to see the Nimble components in action.
            See the <nimble-anchor href="https://nimble.ni.dev/storybook/">Nimble component docs</nimble-anchor> for additional usage details.
            Navigate to the <nimble-anchor href="../index.html">parent page</nimble-anchor>.
        </example-sub-container>
    `,
    standalone: false
})
export class OverviewSectionComponent {}
