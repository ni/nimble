import { Component } from '@angular/core';

@Component({
    selector: 'example-banner-section',
    template: `
        <example-sub-container label="Banner">
            <nimble-banner [(open)]="bannerOpen" severity="information">
                <span slot="title">Title of the banner</span>
                This is the message text of this banner. It tells you something interesting.
            </nimble-banner>
            <nimble-checkbox [(ngModel)]="bannerOpen">Show banner</nimble-checkbox>
        </example-sub-container>
    `,
    standalone: false
})
export class BannerSectionComponent {
    public bannerOpen = true;
}
