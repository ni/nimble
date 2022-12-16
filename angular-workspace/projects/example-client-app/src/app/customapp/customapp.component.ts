/* eslint-disable no-alert */
import { Component, ViewChild } from '@angular/core';
import { DrawerLocation, MenuItem, NimbleDialogDirective, NimbleDrawerDirective, OptionNotFound, OPTION_NOT_FOUND, TableRecord, UserDismissed } from '@ni/nimble-angular';

interface ComboboxItem {
    first: string;
    last: string;
}

interface SimpleTableRecord extends TableRecord {
    stringValue: string;
    numberValue: number;
    dateValue: Date;
    booleanValue: boolean;
}

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public dialogCloseReason: string;
    public drawerCloseReason: string;
    public drawerLocation: DrawerLocation = DrawerLocation.right;
    public isDrawerPinned = false;
    public drawerLocations = DrawerLocation;
    public comboboxItems: ComboboxItem[] = [
        { first: 'foo', last: 'bar' },
        { first: 'Bubba', last: 'Hotep' },
        { first: 'Mister', last: 'Smithers' }
    ];

    public comboboxSelectedOption?: ComboboxItem;
    public comboboxSelectedLastName = this.comboboxSelectedOption?.last;
    public selectedRadio = 'mango';

    public tableData: SimpleTableRecord[] = [
        { stringValue: 'hello world', numberValue: 7, dateValue: new Date(2022, 12, 6), booleanValue: true },
        { stringValue: 'foo', numberValue: 0, dateValue: new Date(2014, 2, 2), booleanValue: true },
        { stringValue: 'bar', numberValue: 20, dateValue: new Date(2022, 7, 30), booleanValue: false },
        { stringValue: 'baz', numberValue: -3, dateValue: new Date(2001, 5, 16), booleanValue: true },
        { stringValue: 'abc 123 456', numberValue: 16, dateValue: new Date(2019, 1, 31), booleanValue: false },
        { stringValue: 'last row', numberValue: 999, dateValue: new Date(2021, 12, 31), booleanValue: true }
    ];

    @ViewChild('dialog', { read: NimbleDialogDirective }) private readonly dialog: NimbleDialogDirective<string>;
    @ViewChild('drawer', { read: NimbleDrawerDirective }) private readonly drawer: NimbleDrawerDirective<string>;

    public onMenuButtonMenuChange(event: Event): void {
        const menuItemText = (event.target as MenuItem).innerText;
        alert(`${menuItemText} selected`);
    }

    public onComboboxChange(value: ComboboxItem | OptionNotFound): void {
        if (value !== OPTION_NOT_FOUND) {
            this.comboboxSelectedLastName = value.last;
        } else {
            this.comboboxSelectedLastName = 'not found';
        }
    }

    public async openDialog(): Promise<void> {
        const closeReason = await this.dialog.show();
        this.dialogCloseReason = (closeReason === UserDismissed) ? 'escape pressed' : closeReason;
    }

    public closeDialog(reason: string): void {
        this.dialog.close(reason);
    }

    public async openDrawer(): Promise<void> {
        const closeReason = await this.drawer.show();
        this.drawerCloseReason = (closeReason === UserDismissed) ? 'escape pressed' : closeReason;
    }

    public closeDrawer(reason: string): void {
        this.drawer.close(reason);
    }

    public onTabToolbarButtonClick(): void {
        alert('Tab toolbar button clicked');
    }

    public onAddTableRow(): void {
        this.tableData = [...this.tableData, {
            stringValue: `new string ${this.tableData.length}`,
            numberValue: this.tableData.length,
            booleanValue: true,
            dateValue: new Date()
        }];
    }
}
