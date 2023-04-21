import { Directive, ElementRef, Input, OnDestroy, Renderer2 } from '@angular/core';
import type { Table } from '@ni/nimble-components/dist/esm/table';
import type { TableRecord, TableFieldName, TableFieldValue, TableValidity, TableActionMenuToggleEventDetail, TableRowSelectionEventDetail } from '@ni/nimble-components/dist/esm/table/types';
import { TableRowSelectionMode } from '@ni/nimble-components/dist/esm/table/types';
import type { Observable, Subscription } from 'rxjs';

export type { Table };
export type { TableActionMenuToggleEventDetail, TableRowSelectionEventDetail };
export { TableRecord, TableFieldName, TableFieldValue, TableValidity, TableRowSelectionMode };

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

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('id-field-name') public set idFieldName(value: string | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'idFieldName', value);
    }

    public get selectionMode(): TableRowSelectionMode {
        return this.elementRef.nativeElement.selectionMode;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('selection-mode') public set selectionMode(value: TableRowSelectionMode) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'selectionMode', value);
    }

    public get collapseAllButtonLabel(): string | undefined {
        return this.elementRef.nativeElement.collapseAllButtonLabel;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('collapse-all-button-label') public set collapseAllButtonLabel(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'collapseAllButtonLabel', value);
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
}
