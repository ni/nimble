import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Table } from '@ni/nimble-components/dist/esm/table';
import type { TableRecord, TableFieldName, TableFieldValue, TableValidity } from '@ni/nimble-components/dist/esm/table/types';

export type { Table };
export { TableRecord, TableFieldName, TableFieldValue, TableValidity };

/**
 * Directive to provide Angular integration for the table element.
 */
@Directive({
    selector: 'nimble-table'
})
export class NimbleTableDirective<TData extends TableRecord = TableRecord> {
    public get data(): TData[] {
        return this.elementRef.nativeElement.data;
    }

    @Input() public set data(value: TData[]) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'data', value);
    }

    public get idFieldName(): string | null | undefined {
        return this.elementRef.nativeElement.idFieldName;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('id-field-name') public set idFieldName(value: string | null | undefined ) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'idFieldName', value);
    }

    public get validity(): TableValidity {
        return this.elementRef.nativeElement.validity;
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Table<TData>>) {}

    public checkValidity(): boolean {
        return this.elementRef.nativeElement.checkValidity();
    }
}
