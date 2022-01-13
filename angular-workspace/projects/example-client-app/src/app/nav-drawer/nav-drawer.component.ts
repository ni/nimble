import { Component, Input, ViewChild } from '@angular/core';
import { DrawerLocation, NimbleDrawerDirective } from '@ni/nimble-angular';

@Component({
    selector: 'nimble-example-nav-drawer',
    templateUrl: './nav-drawer.component.html',
    styleUrls: ['./nav-drawer.component.scss']
})
export class NavDrawerComponent {
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;
    @Input() public location: DrawerLocation = DrawerLocation.Right;
    @ViewChild('drawerReference', { read: NimbleDrawerDirective }) public drawer: NimbleDrawerDirective;

    public open(): void {
        this.drawer.show();
    }

    public close(): void {
        this.drawer.hide();
    }

    public togglePinned(): void {
        this.isDrawerPinned = !this.isDrawerPinned;
        this.drawer.modal = !this.isDrawerPinned;
    }
}
