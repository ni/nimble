/* eslint-disable no-alert */
import { Component } from '@angular/core';
import { DrawerLocation, MenuItem, notFoundSymbol } from '@ni/nimble-angular';

interface ComboboxItem {
    first: string;
    last: string;
}

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public drawerLocation: DrawerLocation = DrawerLocation.right;
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;
    public comboboxSelectedLastName: string;
    public comboboxItems: ComboboxItem[] = [
        { first: 'foo', last: 'bar' },
        { first: 'Bubba', last: 'Hotep' },
        { first: 'Mister', last: 'Smithers' }
    ];

    public comboboxSelectedOption: ComboboxItem;

    public constructor() {
        this.comboboxSelectedOption = this.comboboxItems[0];
        this.comboboxSelectedLastName = this.comboboxSelectedOption.last;
    }

    public onMenuButtonMenuChange(event: Event): void {
        const menuItemText = (event.target as MenuItem).innerText;
        alert(`${menuItemText} selected`);
    }

    public onDrawerLocationChanged(value: DrawerLocation): void {
        alert(`drawerLocation: ${value}`);
    }

    public onComboboxChange(value: ComboboxItem | unknown): void {
        if (value !== notFoundSymbol) {
            this.comboboxSelectedLastName = (value as ComboboxItem).last;
        } else {
            this.comboboxSelectedLastName = 'not found';
        }
    }
}
