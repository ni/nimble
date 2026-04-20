import { Component } from '@angular/core';

@Component({
    selector: 'example-anchor-stepper-section',
    template: `
        <example-sub-container label="Anchor Stepper">
            <nimble-stepper>
                <nimble-anchor-step severity="success" href="https://nimble.ni.dev">
                    <span slot="title">First step</span>
                    <span slot="subtitle">Something we did</span>
                </nimble-anchor-step>
                <nimble-anchor-step selected href="https://ni.com">
                    <span slot="title">Second step</span>
                    <span slot="subtitle">Something we are doing</span>
                </nimble-anchor-step>
                <nimble-anchor-step href="https://google.com">
                    <span slot="title">Third step</span>
                    <span slot="subtitle">Something to do</span>
                </nimble-anchor-step>
            </nimble-stepper>
        </example-sub-container>
    `,
    standalone: false
})
export class AnchorStepperSectionComponent {}
