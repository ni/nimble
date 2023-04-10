/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-restricted-imports */
/* eslint-disable no-alert */
import { Component, ViewChild } from '@angular/core';
import { DrawerLocation, MenuItem, NimbleDialogDirective, NimbleDrawerDirective, OptionNotFound, OPTION_NOT_FOUND, TableRecord, UserDismissed } from '@ni/nimble-angular';
import { BehaviorSubject, Observable } from 'rxjs';
import { DesignSystem } from '@microsoft/fast-foundation';
import { IconThreeVerticalLines } from '@ni/nimble-components/dist/esm/icons/three-vertical-lines';

interface ComboboxItem {
    first: string;
    last: string;
}

interface SimpleTableRecord extends TableRecord {
    stringValue1: string;
    stringValue2: string;
}

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent {
    public bannerOpen = false;
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
    public activeTabId = 'tab-1';
    public activeAnchorTabId = 'a-tab-2';

    public readonly tableData$: Observable<SimpleTableRecord[]>;
    private readonly tableDataSubject = new BehaviorSubject<SimpleTableRecord[]>([
        { stringValue1: 'hello world', stringValue2: 'more text' },
        { stringValue1: 'foo', stringValue2: 'bar' },
        { stringValue1: 'candy', stringValue2: 'bar' },
        { stringValue1: 'dive', stringValue2: 'bar' },
        { stringValue1: 're', stringValue2: 'bar' },
        { stringValue1: 'last row', stringValue2: 'yay!' }
    ]);

    @ViewChild('dialog', { read: NimbleDialogDirective }) private readonly dialog: NimbleDialogDirective<string>;
    @ViewChild('drawer', { read: NimbleDrawerDirective }) private readonly drawer: NimbleDrawerDirective<string>;

    public constructor() {
        this.tableData$ = this.tableDataSubject.asObservable();
    }

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
        alert(`Tab toolbar button clicked, tag name: ${DesignSystem.tagFor(IconThreeVerticalLines)}`);
    }

    public onAddTableRow(): void {
        const tableData = this.tableDataSubject.value;
        tableData.push({
            stringValue1: `new string ${tableData.length}`,
            stringValue2: `bar ${tableData.length}`
        });
        this.tableDataSubject.next(tableData);
    }
}
