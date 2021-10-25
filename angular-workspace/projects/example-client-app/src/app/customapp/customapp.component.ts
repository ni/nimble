import { Component, ViewChild } from '@angular/core';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';
import { NimbleTheme } from '@ni/nimble-components/dist/esm/theme-provider/themes';
import { DrawerLocation, DrawerState, NimbleDrawerDirective } from '@ni/nimble-angular';

@Component({
    selector: 'nimble-example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public theme: NimbleTheme = NimbleTheme.Light;
    public drawerLocation: DrawerLocation = DrawerLocation.Right;
    public isDrawerPinned = false;
    public themes = NimbleTheme;
    public drawerLocations = DrawerLocation;
    public buttonAppearances = ButtonAppearance;

    @ViewChild('drawerReference', { read: NimbleDrawerDirective }) public drawer: NimbleDrawerDirective;

    public drawerTogglePinned(): void {
        this.isDrawerPinned = !this.isDrawerPinned;
        this.drawer.state = this.isDrawerPinned ? DrawerState.Opened : DrawerState.Closed;
    }
}
