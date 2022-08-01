/* eslint-disable no-alert */
import { Component } from '@angular/core';
import { Dialog, DrawerLocation, MenuItem, OptionNotFound, OPTION_NOT_FOUND, TextField, USER_DISMISSED } from '@ni/nimble-angular';

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
    public comboboxItems: ComboboxItem[] = [
        { first: 'foo', last: 'bar' },
        { first: 'Bubba', last: 'Hotep' },
        { first: 'Mister', last: 'Smithers' }
    ];

    public comboboxSelectedOption = this.comboboxItems[0];
    public comboboxSelectedLastName = this.comboboxSelectedOption.last;

    public onMenuButtonMenuChange(event: Event): void {
        const menuItemText = (event.target as MenuItem).innerText;
        alert(`${menuItemText} selected`);
    }

    public onDrawerLocationChanged(value: DrawerLocation): void {
        alert(`drawerLocation: ${value}`);
    }

    public onComboboxChange(value: ComboboxItem | OptionNotFound): void {
        if (value !== OPTION_NOT_FOUND) {
            this.comboboxSelectedLastName = value.last;
        } else {
            this.comboboxSelectedLastName = 'not found';
        }
    }

    public async openDialog(dialog: Dialog, reason: TextField): Promise<void> {
        const closeReason = await dialog.show();
        reason.value = (closeReason === USER_DISMISSED) ? 'escape pressed' : closeReason as string;
    }
}
