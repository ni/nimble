/* eslint-disable no-alert */
import { Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrawerLocation, MenuItem, NimbleDialogDirective, NimbleDrawerDirective, OptionNotFound, OPTION_NOT_FOUND, UserDismissed } from '@ni/nimble-angular';
import type { TableRecord } from '@ni/nimble-angular/table';
import { NimbleRichTextEditorDirective } from '@ni/nimble-angular/rich-text/editor';
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
    date: number;
    statusCode: number;
    result: string;
    number: number;
    duration: number;
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
    public viewerMarkdownString = `Supported rich text formatting options:
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

    public editorMarkdownString = `Supported rich text formatting options:
1. **Bold**
2. *Italics*
3. Numbered lists
    1. Option 1
    2. Option 2
4. Bulleted lists
    * Option 1
    * Option 2
`;

    public readonly tableData$: Observable<SimpleTableRecord[]>;
    private readonly tableDataSubject = new BehaviorSubject<SimpleTableRecord[]>([]);

    @ViewChild('dialog', { read: NimbleDialogDirective }) private readonly dialog: NimbleDialogDirective<string>;
    @ViewChild('drawer', { read: NimbleDrawerDirective }) private readonly drawer: NimbleDrawerDirective<string>;
    @ViewChild('editor', { read: NimbleRichTextEditorDirective }) private readonly editor: NimbleRichTextEditorDirective;

    public constructor(@Inject(ActivatedRoute) public readonly route: ActivatedRoute) {
        this.tableData$ = this.tableDataSubject.asObservable();
        this.addTableRows(10);

        this.comboboxItems = [];
        for (let i = 0; i < 300; i++) {
            this.comboboxItems.push({
                first: i.toString(),
                last: i.toString()
            });
        }
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

    public addTableRows(numberOfRowsToAdd: number): void {
        const tableData = this.tableDataSubject.value;
        for (let i = 0; i < numberOfRowsToAdd; i++) {
            tableData.push({
                id: tableData.length.toString(),
                stringValue1: `new string ${tableData.length}`,
                stringValue2: `bar ${tableData.length}`,
                href: '/customapp',
                linkLabel: 'Link',
                date: (tableData.length % 2 === 0) ? new Date(2023, 7, 16, 3, 56, 11).valueOf() : new Date(2022, 2, 7, 20, 28, 41).valueOf(),
                statusCode: (tableData.length % 2 === 0) ? 100 : 101,
                result: (tableData.length % 2 === 0) ? 'success' : 'unknown',
                number: tableData.length / 10,
                duration: tableData.length * 1000 * (1.1 + 2 * 60 + 3 * 3600)
            });
        }
        this.tableDataSubject.next(tableData);
    }

    public loadRichTextEditorContent(): void {
        // this.editor.setMarkdown(this.editorMarkdownString);
        console.log(this.editor.getMentionedUserList());
    }
}
