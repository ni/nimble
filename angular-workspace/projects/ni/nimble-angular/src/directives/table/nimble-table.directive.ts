import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Table } from '@ni/nimble-components/dist/esm/table';
import type { TableData } from '@ni/nimble-components/dist/esm/table/types';

export type { Table };
export { TableData };

/**
 * Directive to provide Angular integration for the table element.
 */
@Directive({
    selector: 'nimble-table'
})
export class NimbleTableDirective<TData extends TableData> {
    public get data(): TData[] {
        return this.elementRef.nativeElement.data;
    }

    @Input() public set data(value: TData[]) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'data', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Table<TData>>) {}
}
