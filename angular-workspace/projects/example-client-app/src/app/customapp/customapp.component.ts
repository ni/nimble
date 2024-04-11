/* eslint-disable no-alert */
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrawerLocation, MenuItem, NimbleDialogDirective, NimbleDrawerDirective, OptionNotFound, OPTION_NOT_FOUND, UserDismissed } from '@ni/nimble-angular';
import { NimbleTableDirective, TableRecordDelayedHierarchyState, TableRecord, TableRowExpansionToggleEventDetail, TableSetRecordHierarchyOptions } from '@ni/nimble-angular/table';
import { NimbleRichTextEditorDirective } from '@ni/nimble-angular/rich-text/editor';
import { BehaviorSubject, Observable } from 'rxjs';

interface ComboboxItem {
    first: string;
    last: string;
}

interface SimpleTableRecord extends TableRecord {
    id: string;
    parentId?: string;
    stringValue1: string;
    stringValue2: string;
    href?: string;
    linkLabel?: string;
    date: number;
    result: string;
    number: number;
    duration: number;
}

interface PersonTableRecord extends TableRecord {
    id: string;
    parentId?: string;
    firstName: string;
    lastName: string;
    age: number;
    hasChildren?: boolean;
}

@Component({
    selector: 'example-customapp',
    templateUrl: './customapp.component.html',
    styleUrls: ['./customapp.component.scss']
})
export class CustomAppComponent implements AfterViewInit {
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
6. @mention: <user:1>
`;

    public readonly tableData$: Observable<SimpleTableRecord[]>;
    private readonly tableDataSubject = new BehaviorSubject<SimpleTableRecord[]>([]);
    private delayedHierarchyTableData: PersonTableRecord[] = [
        {
            firstName: 'Jacqueline',
            lastName: 'Bouvier',
            age: 80,
            id: 'jacqueline-bouvier',
            parentId: undefined,
            hasChildren: true
        },
        {
            firstName: 'Mona',
            lastName: 'Simpson',
            age: 77,
            id: 'mona-simpson',
            parentId: undefined,
            hasChildren: true
        },
        {
            firstName: 'Agnes',
            lastName: 'Skinner',
            age: 88,
            id: 'agnes-skinner',
            parentId: undefined,
            hasChildren: true
        },
    ];

    private readonly recordsLoadingChildren = new Set<string>();
    private readonly recordsWithLoadedChildren = new Set<string>();

    @ViewChild('dialog', { read: NimbleDialogDirective }) private readonly dialog: NimbleDialogDirective<string>;
    @ViewChild('drawer', { read: NimbleDrawerDirective }) private readonly drawer: NimbleDrawerDirective<string>;
    @ViewChild('editor', { read: NimbleRichTextEditorDirective }) private readonly editor: NimbleRichTextEditorDirective;
    @ViewChild('delayedHierarchyTable', { read: NimbleTableDirective }) private readonly delayedHierarchyTable: NimbleTableDirective<PersonTableRecord>;

    public constructor(@Inject(ActivatedRoute) public readonly route: ActivatedRoute) {
        this.tableData$ = this.tableDataSubject.asObservable();
        this.addTableRows(10);
    }

    public ngAfterViewInit(): void {
        void this.updateDelayedHierarchyTable();
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
                parentId: (tableData.length >= 4 ? (tableData.length % 4).toString() : undefined),
                stringValue1: `new string ${tableData.length}`,
                stringValue2: `bar ${tableData.length}`,
                href: '/customapp',
                linkLabel: 'Link',
                date: (tableData.length % 2 === 0) ? new Date(2023, 7, 16, 3, 56, 11).valueOf() : new Date(2022, 2, 7, 20, 28, 41).valueOf(),
                result: (tableData.length % 2 === 0) ? 'success' : 'unknown',
                number: tableData.length / 10,
                duration: tableData.length * 1000 * (1.1 + 2 * 60 + 3 * 3600)
            });
        }
        this.tableDataSubject.next(tableData);
    }

    public loadRichTextEditorContent(): void {
        this.editor.setMarkdown(this.markdownString);
    }

    public onRowExpandToggle(e: Event): void {
        const event = e as CustomEvent<TableRowExpansionToggleEventDetail>;
        const recordId = event.detail.recordId;
        if (event.detail.newState && !this.recordsLoadingChildren.has(recordId) && !this.recordsWithLoadedChildren.has(recordId)) {
            const record = this.delayedHierarchyTableData.find(x => x.id === recordId && x.hasChildren);
            if (!record) {
                return;
            }

            this.recordsLoadingChildren.add(recordId);
            void this.updateDelayedHierarchyTable(false);

            window.setTimeout(() => {
                this.delayedHierarchyTableData = [
                    ...this.delayedHierarchyTableData,
                    ...this.getChildren(recordId)
                ];
                this.recordsLoadingChildren.delete(recordId);
                this.recordsWithLoadedChildren.add(recordId);
                void this.updateDelayedHierarchyTable();
            }, 1500);
        }
    }

    private async updateDelayedHierarchyTable(setData = true): Promise<void> {
        if (setData) {
            await this.delayedHierarchyTable.setData(this.delayedHierarchyTableData);
        }
        const hierarchyOptions = this.delayedHierarchyTableData.filter(person => {
            return person.hasChildren && !this.recordsWithLoadedChildren.has(person.id);
        }).map<TableSetRecordHierarchyOptions>(person => {
            const state = this.recordsLoadingChildren.has(person.id)
                ? TableRecordDelayedHierarchyState.loadingChildren
                : TableRecordDelayedHierarchyState.canLoadChildren;
            return {
                recordId: person.id,
                options: { delayedHierarchyState: state }
            };
        });
        await this.delayedHierarchyTable.setRecordHierarchyOptions(hierarchyOptions);
    }

    private getChildren(id: string): PersonTableRecord[] {
        switch (id) {
            case 'jacqueline-bouvier':
                return [{
                    firstName: 'Marge',
                    lastName: 'Simpson',
                    age: 35,
                    id: 'marge-simpson',
                    parentId: id,
                    hasChildren: true
                }, {
                    firstName: 'Selma',
                    lastName: 'Bouvier',
                    age: 45,
                    id: 'selma-bouvier',
                    parentId: id
                }, {
                    firstName: 'Patty',
                    lastName: 'Bouvier',
                    age: 45,
                    id: 'patty-bouvier',
                    parentId: id
                }];
            case 'marge-simpson':
                return [{
                    firstName: 'Bart',
                    lastName: 'Simpson',
                    age: 12,
                    id: 'bart-simpson',
                    parentId: id
                }, {
                    firstName: 'Lisa',
                    lastName: 'Simpson',
                    age: 10,
                    id: 'lisa-simpson',
                    parentId: id
                }, {
                    firstName: 'Maggie',
                    lastName: 'Simpson',
                    age: 1,
                    id: 'maggie-simpson',
                    parentId: id
                }];
            case 'mona-simpson':
                return [{
                    firstName: 'Homer',
                    lastName: 'Simpson',
                    age: 35,
                    id: 'homer-simpson',
                    parentId: id
                }];
            case 'agnes-skinner':
                return [{
                    firstName: 'Seymour',
                    lastName: 'Skinner',
                    age: 42,
                    id: 'seymour-skinner',
                    parentId: id
                }];
            default:
                return [];
        }
    }
}
