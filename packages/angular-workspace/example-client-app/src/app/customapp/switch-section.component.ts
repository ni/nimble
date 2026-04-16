import { Component } from '@angular/core';

@Component({
    selector: 'example-switch-section',
    template: `
        <example-sub-container label="Switch">
            <nimble-switch>Switch</nimble-switch>
            <nimble-switch checked>
                Switch with checked/unchecked messages
                <span slot="unchecked-message">Off</span>
                <span slot="checked-message">On</span>
            </nimble-switch>
        </example-sub-container>
    `,
    standalone: false
})
export class SwitchSectionComponent {}
