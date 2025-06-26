import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { TableColumn } from '@ni/nimble-components/dist/esm/table-column/base';
import type { DelegatedEventEventDetails, TableColumnValidity } from '@ni/nimble-components/dist/esm/table-column/base/types';
import { TableColumnSortDirection } from '@ni/nimble-components/dist/esm/table/types';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export { TableColumnSortDirection, type DelegatedEventEventDetails, type TableColumnValidity };

/**
 * Base class for table column directives.
 */
@Directive()
export class NimbleTableColumnBaseDirective<T extends TableColumn> {
    public get columnId(): string | undefined {
        return this.elementRef.nativeElement.columnId;
    }

    @Input('column-id') public set columnId(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnId', value);
    }

    public get actionMenuSlot(): string | undefined {
        return this.elementRef.nativeElement.actionMenuSlot;
    }

    @Input('action-menu-slot') public set actionMenuSlot(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'actionMenuSlot', value);
    }

    public get actionMenuLabel(): string | undefined {
        return this.elementRef.nativeElement.actionMenuLabel;
    }

    @Input('action-menu-label') public set actionMenuLabel(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'actionMenuLabel', value);
    }

    public get columnHidden(): boolean {
        return this.elementRef.nativeElement.columnHidden;
    }

    @Input('column-hidden') public set columnHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnHidden', toBooleanProperty(value));
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<T>) {}

    public checkValidity(): boolean {
        return this.elementRef.nativeElement.checkValidity();
    }

    public get validity(): TableColumnValidity {
        return this.elementRef.nativeElement.validity;
    }
}