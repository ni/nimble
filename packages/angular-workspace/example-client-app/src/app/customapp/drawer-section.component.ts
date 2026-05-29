import { Component, ViewChild } from '@angular/core';
import { DrawerLocation, NimbleDrawerDirective, UserDismissed } from '@ni/nimble-angular';

@Component({
    selector: 'example-drawer-section',
    template: `
        <example-sub-container label="Drawer">
            <nimble-drawer #drawer [location]="drawerLocation">
                <header>This is a drawer</header>
                <section>
                    <p style="height: 1000px;">It opened when you pushed the button</p>
                    <p>This is the bottom!</p>
                </section>
                <footer class="drawer-footer">
                    <nimble-button appearance="ghost" (click)="closeDrawer('cancel pressed')">Cancel</nimble-button>
                    <nimble-button (click)="closeDrawer('OK pressed')">OK</nimble-button>
                </footer>
            </nimble-drawer>
            <nimble-button (click)="openDrawer()">Open Drawer</nimble-button>
            <nimble-text-field readonly [ngModel]="drawerCloseReason">Closed Reason</nimble-text-field>
            <nimble-select class="drawer-location-select" [(ngModel)]="drawerLocation">
                Drawer Location
                <nimble-list-option [value]="drawerLocations.left">Drawer: Left-side</nimble-list-option>
                <nimble-list-option [value]="drawerLocations.right">Drawer: Right-side</nimble-list-option>
            </nimble-select>
        </example-sub-container>
    `,
    styles: [`
        @use '@ni/nimble-angular/styles/tokens' as *;
        .drawer-location-select { width: 200px; }
        .drawer-footer { gap: $ni-nimble-standard-padding; }
        nimble-drawer p { color: $ni-nimble-body-font-color; }
    `],
    standalone: false
})
export class DrawerSectionComponent {
    public drawerCloseReason = '';
    public drawerLocation: DrawerLocation = DrawerLocation.right;
    public drawerLocations = DrawerLocation;

    @ViewChild('drawer', { read: NimbleDrawerDirective }) private readonly drawer: NimbleDrawerDirective<string>;

    public async openDrawer(): Promise<void> {
        const closeReason = await this.drawer.show();
        this.drawerCloseReason = (closeReason === UserDismissed) ? 'escape pressed' : closeReason;
    }

    public closeDrawer(reason: string): void {
        this.drawer.close(reason);
    }
}
