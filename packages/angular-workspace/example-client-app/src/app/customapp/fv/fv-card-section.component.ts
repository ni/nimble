import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-card-section',
    template: `
        <example-sub-container label="Fv Card (Ok)">
            <ok-fv-card
                card-title="Device health"
                subtitle="Cell A"
                description="Track operator-facing status, ownership, and pending alerts for a selected asset."
                initials="DH"
                interaction-mode="card"
            >
                <span slot="badges">Approved</span>
                <span slot="footer-start">Updated now</span>
                <span slot="footer-end">4 alerts</span>
            </ok-fv-card>
        </example-sub-container>
    `,
    standalone: false
})
export class FvCardSectionComponent {}