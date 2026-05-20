import { type AfterViewInit, Component, ViewChild } from '@angular/core';
import { NimbleTableDirective, TableRecordDelayedHierarchyState, type TableRecord, type TableRowExpansionToggleEventDetail, type TableSetRecordHierarchyOptions } from '@ni/nimble-angular/table';

interface PersonTableRecord extends TableRecord {
    id: string;
    parentId?: string;
    firstName: string;
    lastName: string;
    age: number;
    hasChildren?: boolean;
}

@Component({
    selector: 'example-delayed-hierarchy-table-section',
    template: `
        <example-sub-container label="Table with delayed hierarchy">
            <nimble-table #delayedHierarchyTable id-field-name="id" parent-id-field-name="parentId" selection-mode="multiple" (row-expand-toggle)="onRowExpandToggle($event)">
                <nimble-table-column-text
                    field-name="firstName"
                >
                    First name
                </nimble-table-column-text>
                <nimble-table-column-text
                    field-name="lastName"
                >
                    Last name
                </nimble-table-column-text>
                <nimble-table-column-number-text
                    field-name="age"
                    format="decimal"
                    decimal-digits="0"
                >
                    Age
                </nimble-table-column-number-text>
            </nimble-table>
        </example-sub-container>
    `,
    styles: [`
        nimble-table { max-height: 480px; }
    `],
    standalone: false
})
export class DelayedHierarchyTableSectionComponent implements AfterViewInit {
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

    @ViewChild('delayedHierarchyTable', { read: NimbleTableDirective }) private readonly delayedHierarchyTable: NimbleTableDirective<PersonTableRecord>;

    public ngAfterViewInit(): void {
        void this.updateDelayedHierarchyTable();
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
