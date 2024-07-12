import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NumberValueOrAttribute, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective } from '@ni/nimble-angular/table-column';
import { TableColumnMenuButton, tableColumnMenuButtonTag } from '@ni/nimble-components/dist/esm/table-column/menu-button';
import type { MenuButtonColumnToggleEventDetail } from '@ni/nimble-components/dist/esm/table-column/menu-button/types';

export type { TableColumnMenuButton, MenuButtonColumnToggleEventDetail };
export { tableColumnMenuButtonTag };

/**
 * Directive to provide Angular integration for the table column element for a menu button.
 */
@Directive({
    selector: 'nimble-table-column-menu-button'
})
export class NimbleTableColumnMenuButtonDirective extends NimbleTableColumnBaseDirective<TableColumnMenuButton> {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
    }

    public get menuSlot(): string | undefined {
        return this.elementRef.nativeElement.menuSlot;
    }

    @Input('menu-slot') public set menuSlot(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'menuSlot', value);
    }

    public get fractionalWidth(): number | null | undefined {
        return this.elementRef.nativeElement.fractionalWidth;
    }

    @Input('fractional-width') public set fractionalWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fractionalWidth', toNullableNumberProperty(value));
    }

    public get minPixelWidth(): number | null | undefined {
        return this.elementRef.nativeElement.minPixelWidth;
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnMenuButton>) {
        super(renderer, elementRef);
    }
}
