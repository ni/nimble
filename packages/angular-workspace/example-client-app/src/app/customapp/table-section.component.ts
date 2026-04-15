import { Component } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import type { TableRecord } from '@ni/nimble-angular/table';
import type { MenuButtonColumnToggleEventDetail } from '@ni/nimble-angular/table-column/menu-button';

const colors = ['Red', 'Green', 'Blue', 'Black', 'Yellow'] as const;
type Color = typeof colors[number];

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
    color: Color;
}

@Component({
    selector: 'example-table-section',
    template: `
        <example-sub-container label="Table">
            <nimble-table [data$]="tableData$" id-field-name="id" parent-id-field-name="parentId" selection-mode="multiple">
                <nimble-table-column-text
                    field-name="stringValue1"
                    action-menu-slot="action-menu"
                    action-menu-label="Action menu"
                    fractional-width="2"
                    min-pixel-width="300"
                    sort-direction="ascending"
                    sort-index="0"
                >
                    <nimble-icon-check title="String 1"></nimble-icon-check>
                </nimble-table-column-text>
                <nimble-table-column-anchor
                    href-field-name="href"
                    label-field-name="linkLabel"
                >
                    Link
                </nimble-table-column-anchor>
                <nimble-table-column-date-text
                    field-name="date"
                >
                    Date
                </nimble-table-column-date-text>
                <nimble-table-column-mapping
                    field-name="statusCode"
                    key-type="number"
                >
                    <nimble-mapping-text key="100" text="Status message 1"></nimble-mapping-text>
                    <nimble-mapping-text key="101" text="Status message 2"></nimble-mapping-text>
                    Status
                </nimble-table-column-mapping>
                <nimble-table-column-mapping
                    field-name="result"
                    key-type="string"
                    width-mode="icon-size"
                >
                    <nimble-mapping-icon
                        key="success"
                        text="Success"
                        icon="nimble-icon-check"
                        severity="success"
                        text-hidden>
                    </nimble-mapping-icon>
                    <nimble-mapping-spinner
                        key="calculating"
                        text="Calculating"
                        text-hidden>
                    </nimble-mapping-spinner>
                    <nimble-mapping-empty
                        key="unknown"
                        text="Unknown">
                    </nimble-mapping-empty>
                    <nimble-icon-xmark-check title="Result"></nimble-icon-xmark-check>
                </nimble-table-column-mapping>
                <nimble-table-column-number-text
                    field-name="number"
                >
                    Number
                </nimble-table-column-number-text>
                <nimble-table-column-duration-text
                    field-name="duration"
                >
                    Duration
                </nimble-table-column-duration-text>
                <nimble-table-column-text field-name="stringValue2" min-pixel-width="400" group-index="0">String 2</nimble-table-column-text>
                <nimble-table-column-menu-button field-name="color" menu-slot="color-menu"
                    (menu-button-column-beforetoggle)="onMenuButtonColumnBeforeToggle($event)"
                >
                    Color
                </nimble-table-column-menu-button>

                <nimble-menu slot="action-menu">
                    <nimble-menu-item>Item 1</nimble-menu-item>
                    <nimble-menu-item>Item 2</nimble-menu-item>
                    <nimble-menu-item>Item 3</nimble-menu-item>
                </nimble-menu>

                <nimble-menu slot="color-menu">
                    <nimble-menu-item *ngFor="let color of possibleColors" (change)="onColorSelected(color)">
                        <nimble-icon-check *ngIf="color === currentColor" slot="start"></nimble-icon-check>
                        {{ color }}
                    </nimble-menu-item>
                </nimble-menu>
            </nimble-table>
            <nimble-button class="add-table-row-button" (click)="addTableRows(10)">Add rows</nimble-button>
        </example-sub-container>
    `,
    styles: [`
        @use '@ni/nimble-angular/styles/tokens' as *;
        nimble-table { max-height: 480px; }
        .add-table-row-button { margin-top: $ni-nimble-small-padding; }
    `],
    standalone: false
})
export class TableSectionComponent {
    public possibleColors = colors;
    public currentColor?: Color;
    public openMenuButtonColumnRecordId?: string;
    public readonly tableData$: Observable<SimpleTableRecord[]>;
    private readonly tableDataSubject = new BehaviorSubject<SimpleTableRecord[]>([]);

    public constructor() {
        this.tableData$ = this.tableDataSubject.asObservable();
        this.addTableRows(10);
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
                duration: tableData.length * 1000 * (1.1 + 2 * 60 + 3 * 3600),
                color: colors[tableData.length % colors.length]
            });
        }
        this.tableDataSubject.next(tableData);
    }

    public onMenuButtonColumnBeforeToggle(event: Event): void {
        const customEvent = event as CustomEvent<MenuButtonColumnToggleEventDetail>;
        if (customEvent.detail.newState) {
            this.openMenuButtonColumnRecordId = customEvent.detail.recordId;
            const tableData = this.tableDataSubject.value;
            const currentRecord = tableData.find(record => record.id === customEvent.detail.recordId)!;
            this.currentColor = currentRecord.color;
        }
    }

    public onColorSelected(color: Color): void {
        const data = this.tableDataSubject.value;
        const recordToUpdate = data.find(record => record.id === this.openMenuButtonColumnRecordId);
        if (!recordToUpdate) {
            return;
        }
        recordToUpdate.color = color;
        this.tableDataSubject.next(data);
    }
}
