/* eslint-disable no-alert */
import { Component, OnInit } from '@angular/core';
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
export class CustomAppComponent implements OnInit {
    public drawerLocation: DrawerLocation = DrawerLocation.right;
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;
    public lastName: string;
    public comboboxItems: ComboboxItem[] = [
        { first: 'foo', last: 'bar' },
        { first: 'Bubba', last: 'Hotep' },
        { first: 'Mister', last: 'Smithers' }
    ];

    public selectedOption: ComboboxItem;

    public onMenuButtonMenuChange(event: Event): void {
        const menuItemText = (event.target as MenuItem).innerText;
        alert(`${menuItemText} selected`);
    }

    public onDrawerLocationChanged(value: DrawerLocation): void {
        alert(`drawerLocation: ${value}`);
    }

    public onComboboxChange(value: ComboboxItem | unknown): void {
        if (value !== notFoundSymbol) {
            this.lastName = (value as ComboboxItem).last;
        } else {
            this.lastName = 'not found';
        }
    }

    public ngOnInit(): void {
        this.selectedOption = this.comboboxItems[0];
        this.lastName = this.selectedOption.last;
    }

    public comboboxDisplayName(value: unknown | null | undefined): string | undefined {
        return (value !== null && value !== undefined) ? (value as ComboboxItem).first : '';
    }
}
