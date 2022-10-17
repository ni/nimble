import { Directive, ElementRef, Renderer2 } from '@angular/core';
import type { Table } from '@ni/nimble-components/dist/esm/table';

export type { Table };

/**
 * Directive to provide Angular integration for the tabs element.
 */
@Directive({
    selector: 'nimble-table'
})
export class NimbleTableDirective {
    public get data(): unknown[] {
        return this.elementRef.nativeElement.data;
    }

    public set data(value: unknown[]) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'data', value);
    }

    public get columns(): unknown {
        return this.elementRef.nativeElement.columns;
    }

    public set columns(value: unknown) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columns', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Table>) {}
}
