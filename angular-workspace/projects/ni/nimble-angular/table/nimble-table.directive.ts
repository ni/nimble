import { Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import { type Table, tableTag } from '@ni/nimble-components/dist/esm/table';
import type { TableRecord, TableFieldName, TableFieldValue, TableValidity, TableActionMenuToggleEventDetail, TableRowSelectionEventDetail, TableColumnConfigurationChangeEventDetail, TableColumnConfiguration, TableRowExpansionToggleEventDetail } from '@ni/nimble-components/dist/esm/table/types';
import { TableRowSelectionMode, TableRecordDelayedHierarchyState, TableSetRecordHierarchyOptions, TableRecordHierarchyOptions } from '@ni/nimble-components/dist/esm/table/types';
import type { Observable, Subscription } from 'rxjs';

export type { Table };
export { tableTag };
export type { TableActionMenuToggleEventDetail, TableRowSelectionEventDetail, TableColumnConfigurationChangeEventDetail, TableColumnConfiguration, TableRowExpansionToggleEventDetail };
export { TableRecord, TableFieldName, TableFieldValue, TableValidity, TableRowSelectionMode, TableRecordDelayedHierarchyState, TableSetRecordHierarchyOptions, TableRecordHierarchyOptions };

/**
 * Directive to provide Angular integration for the table element.
 */
@Directive({
    selector: 'nimble-table'
})
export class NimbleTableDirective<TData extends TableRecord = TableRecord> implements OnDestroy {
    public get data$(): Observable<TData[]> | undefined {
        return this.dataObservable;
    }

    /**
     * An `Observable<TData[]>` that emits data that should be set on the table.
     *
     * When using `data$`, the timing of when the table has been updated with a new collection of data
     * cannot be observed or await by an application. If an application needs to know when the data has
     * been applied, explicitly call `setData()` rather than using the `data$` property. For example,
     * calling `getSelectedRecordIds()` immediately after emitting a new value to the `data$` `Observable`
     * may not take the new data into account when determining the selected records.
     */
    @Input() public set data$(value: Observable<TData[]> | undefined) {
        this.dataSubscription?.unsubscribe();

        this.dataObservable = value;
        if (value) {
            this.dataSubscription = value.subscribe(
                next => {
                    void this.setData(next);
                }
            );
        }
    }

    public get idFieldName(): string | null | undefined {
        return this.elementRef.nativeElement.idFieldName;
    }

    @Input('id-field-name') public set idFieldName(value: string | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'idFieldName', value);
    }

    public get parentIdFieldName(): string | null | undefined {
        return this.elementRef.nativeElement.parentIdFieldName;
    }

    @Input('parent-id-field-name') public set parentIdFieldName(value: string | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'parentIdFieldName', value);
    }

    public get selectionMode(): TableRowSelectionMode {
        return this.elementRef.nativeElement.selectionMode;
    }

    @Input('selection-mode') public set selectionMode(value: TableRowSelectionMode) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selectionMode', value);
    }

    public get validity(): TableValidity {
        return this.elementRef.nativeElement.validity;
    }

    private dataObservable?: Observable<TData[]>;
    private dataSubscription?: Subscription;

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Table<TData>>) {}

    public ngOnDestroy(): void {
        this.dataSubscription?.unsubscribe();
    }

    public checkValidity(): boolean {
        return this.elementRef.nativeElement.checkValidity();
    }

    public async setData(data: readonly TData[]): Promise<void> {
        return this.elementRef.nativeElement.setData(data);
    }

    public async getSelectedRecordIds(): Promise<string[]> {
        return this.elementRef.nativeElement.getSelectedRecordIds();
    }

    public async setSelectedRecordIds(recordIds: string[]): Promise<void> {
        return this.elementRef.nativeElement.setSelectedRecordIds(recordIds);
    }

    public async setRecordHierarchyOptions(hierarchyOptions: TableSetRecordHierarchyOptions[]): Promise<void> {
        return this.elementRef.nativeElement.setRecordHierarchyOptions(hierarchyOptions);
    }
}
