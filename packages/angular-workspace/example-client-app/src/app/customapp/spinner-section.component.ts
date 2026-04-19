import { Component } from '@angular/core';

@Component({
    selector: 'example-spinner-section',
    template: `
        <example-sub-container label="Spinner">
            <nimble-spinner aria-label="Loading example content"></nimble-spinner>
        </example-sub-container>
    `,
    standalone: false
})
export class SpinnerSectionComponent {}
