import { Component } from '@angular/core';

@Component({
    selector: 'example-fv-card-section',
    template: `
        <example-sub-container label="Fv Card (Ok)">
            <ok-fv-card
                card-title="Device health"
                i18n-card-title
                subtitle="Cell A"
                i18n-subtitle
                description="Track operator-facing status, ownership, and pending alerts for a selected asset."
                i18n-description
                initials="DH"
                i18n-initials
                interactionMode="card"
                i18n-interactionMode
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