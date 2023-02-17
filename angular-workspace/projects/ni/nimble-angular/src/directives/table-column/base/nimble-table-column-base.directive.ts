import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { TableColumn } from '@ni/nimble-components/dist/esm/table-column/base';

/**
 * Base class for table column directives.
 */
@Directive()
export class NimbleTableColumnBaseDirective<T extends TableColumn> {
    public get columnId(): string | undefined {
        return this.elementRef.nativeElement.columnId;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('column-id') public set columnId(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnId', value);
    }

    public get actionMenuSlot(): string | undefined {
        return this.elementRef.nativeElement.actionMenuSlot;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('action-menu-slot') public set actionMenuSlot(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'actionMenuSlot', value);
    }

    public get actionMenuLabel(): string | undefined {
        return this.elementRef.nativeElement.actionMenuLabel;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('action-menu-label') public set actionMenuLabel(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'actionMenuLabel', value);
    }

    public constructor(protected readonly renderer: Renderer2, protected readonly elementRef: ElementRef<T>) {}
}