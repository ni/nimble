/* eslint-disable no-alert */
import { AfterViewInit, Component, Inject, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DrawerLocation, MenuItem, NimbleDialogDirective, NimbleDrawerDirective, OptionNotFound, OPTION_NOT_FOUND, UserDismissed, SelectFilterInputEventDetail, NimbleSelectDirective } from '@ni/nimble-angular';
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
    statusCode: number;
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

    public dynamicSelectItems: ComboboxItem[] = [];

    public comboboxSelectedOption?: ComboboxItem;
    public comboboxSelectedLastName = this.comboboxSelectedOption?.last;
    public dynamicSelectPlaceholderValue = null;
    public dynamicSelectValue: ComboboxItem | null = null;
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

    private readonly availableSelectItems = [
        { first: 'Homer', last: 'Simpson' },
        { first: 'Marge', last: 'Simpson' },
        { first: 'Bart', last: 'Simpson' },
        { first: 'Lisa', last: 'Simpson' },
        { first: 'Maggie', last: 'Simpson' },
        { first: 'Mona', last: 'Simpson' },
        { first: 'Jacqueline', last: 'Bouvier' },
        { first: 'Selma', last: 'Bouvier' },
        { first: 'Patty', last: 'Bouvier' },
        { first: 'Abe', last: 'Simpson' },
        { first: 'Ned', last: 'Flanders' },
        { first: 'Maude', last: 'Flanders' },
        { first: 'Rod', last: 'Flanders' },
        { first: 'Todd', last: 'Flanders' }
    ];

    private readonly localSelectItems = this.availableSelectItems.slice(0, 5);
    private dynamicSelectFilterTimeout?: number;
    private hideSelectedItem = false;
    private readonly recordsLoadingChildren = new Set<string>();
    private readonly recordsWithLoadedChildren = new Set<string>();

    @ViewChild('dialog', { read: NimbleDialogDirective }) private readonly dialog: NimbleDialogDirective<string>;
    @ViewChild('drawer', { read: NimbleDrawerDirective }) private readonly drawer: NimbleDrawerDirective<string>;
    @ViewChild('editor', { read: NimbleRichTextEditorDirective }) private readonly editor: NimbleRichTextEditorDirective;
    @ViewChild('delayedHierarchyTable', { read: NimbleTableDirective }) private readonly delayedHierarchyTable: NimbleTableDirective<PersonTableRecord>;
    @ViewChild('dynamicSelect', { read: NimbleSelectDirective }) private readonly dynamicSelect: NimbleSelectDirective;

    public constructor(@Inject(ActivatedRoute) public readonly route: ActivatedRoute) {
        this.tableData$ = this.tableDataSubject.asObservable();
        this.addTableRows(10);
        this.dynamicSelectItems = this.localSelectItems;
    }

    public ngAfterViewInit(): void {
        void this.updateDelayedHierarchyTable();
    }

    public onMenuButtonMenuChange(event: Event): void {
        const menuItemText = (event.target as MenuItem).innerText;
        alert(`${menuItemText} selected`);
    }

    public onDynamicSelectFilterInput(e: Event): void {
        const event = e as CustomEvent<SelectFilterInputEventDetail>;
        const filter = event.detail.filterText;
        if (filter.length > 0) {
            window.clearTimeout(this.dynamicSelectFilterTimeout);
            this.dynamicSelect.loadingVisible = true;
            this.dynamicSelectFilterTimeout = window.setTimeout(() => {
                // do your custom filtering here
                const filteredItems = this.availableSelectItems.filter(item => item.first.concat(item.last).toLowerCase().includes(filter.toLowerCase()));
                this.setDynamicSelectItems(filteredItems);
                this.hideSelectedItem = (this.dynamicSelectValue && !filteredItems.includes(this.dynamicSelectValue))
                    ?? false;
                this.dynamicSelect.loadingVisible = false;
            }, 2000); // simulate async loading with debounce
        } else {
            this.hideSelectedItem = false;
            window.clearTimeout(this.dynamicSelectFilterTimeout);
            this.setDynamicSelectItems(this.localSelectItems);
            this.dynamicSelect.loadingVisible = false;
        }
    }

    public shouldHideSelectedItem(value: ComboboxItem): boolean {
        if (value === this.dynamicSelectValue && this.hideSelectedItem) {
            return true;
        }

        return false;
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
        const possibleStatuses = ['success', 'calculating', 'unknown'];
        for (let i = 0; i < numberOfRowsToAdd; i++) {
            tableData.push({
                id: tableData.length.toString(),
                parentId: (tableData.length >= 4 ? (tableData.length % 4).toString() : undefined),
                stringValue1: `new string ${tableData.length}`,
                stringValue2: `bar ${tableData.length}`,
                href: '/customapp',
                linkLabel: 'Link',
                date: (tableData.length % 2 === 0) ? new Date(2023, 7, 16, 3, 56, 11).valueOf() : new Date(2022, 2, 7, 20, 28, 41).valueOf(),
                statusCode: (tableData.length % 2 === 0) ? 100 : 101,
                result: possibleStatuses[tableData.length % 3],
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

    private setDynamicSelectItems(dynamicSelectItems: ComboboxItem[]): void {
        if (this.dynamicSelectValue && !dynamicSelectItems.includes(this.dynamicSelectValue)) {
            this.dynamicSelectItems = [...dynamicSelectItems, this.dynamicSelectValue];
        } else {
            this.dynamicSelectItems = dynamicSelectItems;
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
