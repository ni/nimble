/* eslint-disable no-alert */
import { Component } from '@angular/core';
import { Combobox, DrawerLocation, MenuItem } from '@ni/nimble-angular';

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public drawerLocation: DrawerLocation = DrawerLocation.right;
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;
    public comboboxValue: string;

    public onMenuButtonMenuChange(event: Event): void {
        const menuItemText = (event.target as MenuItem).innerText;
        alert(`${menuItemText} selected`);
    }

    public onComboboxChange(event: Event): void {
        this.comboboxValue = (event.target as Combobox).value;
    }
}
