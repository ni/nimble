import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { TableColumnText } from '@ni/nimble-components/dist/esm/table-column/text';

export type { TableColumnText };

/**
 * Directive to provide Angular integration for the table column element for text.
 */
@Directive({
    selector: 'nimble-table-column-text'
})
export class NimbleTableColumnTextDirective {
    public get columnId(): string | undefined {
        return this.elementRef.nativeElement.columnId;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('column-id') public set columnId(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'columnId', value);
    }

    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
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

    public get placeholder(): string | undefined {
        return this.elementRef.nativeElement.placeholder;
    }

    public set placeholder(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<TableColumnText>) {}
}
