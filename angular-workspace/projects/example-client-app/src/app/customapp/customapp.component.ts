/* eslint-disable no-alert */
import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrawerLocation, MenuItem, NimbleDialogDirective, NimbleDrawerDirective, OptionNotFound, OPTION_NOT_FOUND, UserDismissed } from '@ni/nimble-angular';
import type { TableRecord } from '@ni/nimble-angular/table';
import { BehaviorSubject, Observable } from 'rxjs';

interface ComboboxItem {
    first: string;
    last: string;
}

interface SimpleTableRecord extends TableRecord {
    id: string;
    stringValue1: string;
    stringValue2: string;
    href?: string;
    linkLabel?: string;
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
    public markdownString = `Supported rich text formatting options:
1. **Bold**
2. *Italics*
3. Numbered lists
    1. Option 1
    2. Option 2
4. Bulleted lists
    * Option 1
    * Option 2
5. Absolute link: <https://nimble.ni.dev/>
`;

    public readonly tableData$: Observable<SimpleTableRecord[]>;
    private readonly tableDataSubject = new BehaviorSubject<SimpleTableRecord[]>([]);

    @ViewChild('dialog', { read: NimbleDialogDirective }) private readonly dialog: NimbleDialogDirective<string>;
    @ViewChild('drawer', { read: NimbleDrawerDirective }) private readonly drawer: NimbleDrawerDirective<string>;

    public constructor(@Inject(ActivatedRoute) public readonly route: ActivatedRoute) {
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
        alert('Tab toolbar button clicked');
    }

    public onAddTableRow(): void {
        const tableData = this.tableDataSubject.value;
        tableData.push({
            id: tableData.length.toString(),
            stringValue1: `new string ${tableData.length}`,
            stringValue2: `bar ${tableData.length}`,
            href: '/customapp',
            linkLabel: 'Link'
        });
        this.tableDataSubject.next(tableData);
    }
}
