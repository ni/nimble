import { Component } from '@angular/core';

@Component({
    selector: 'example-stepper-section',
    template: `
        <example-sub-container label="Stepper">
            <nimble-stepper>
                <nimble-step severity="success">
                    <span slot="title">First step</span>
                    <span slot="subtitle">Something we did</span>
                </nimble-step>
                <nimble-step selected>
                    <span slot="title">Second step</span>
                    <span slot="subtitle">Something we are doing</span>
                </nimble-step>
                <nimble-step>
                    <span slot="title">Third step</span>
                    <span slot="subtitle">Something to do</span>
                </nimble-step>
            </nimble-stepper>
        </example-sub-container>
    `,
    standalone: false
})
export class StepperSectionComponent {}
