/* eslint-disable no-alert */
import { Component } from '@angular/core';
import { DrawerLocation, MenuItem } from '@ni/nimble-angular';

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public drawerLocation: DrawerLocation = DrawerLocation.Right;
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;

    public onMenuButtonMenuChange(event: Event): void {
        const menuItemText = (event.target as MenuItem).innerText;
        alert(`${menuItemText} selected`);
    }
}
