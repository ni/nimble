import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type TableColumnText, tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective } from '@ni/nimble-angular/table-column';

export type { TableColumnText };
export { tableColumnTextTag };

/**
 * Directive to provide Angular integration for the table column element for text.
 */
@Directive({
    selector: 'nimble-table-column-text'
})
export class NimbleTableColumnTextDirective extends NimbleTableColumnBaseDirective<TableColumnText> {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    // Renaming because property should have camel casing, but attribute should not
    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
    }

    public get fractionalWidth(): number | null | undefined {
        return this.elementRef.nativeElement.fractionalWidth;
    }

    // Renaming because property should have camel casing, but attribute should not
    @Input('fractional-width') public set fractionalWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fractionalWidth', toNullableNumberProperty(value));
    }

    public get minPixelWidth(): number | null | undefined {
        return this.elementRef.nativeElement.minPixelWidth;
    }

    // Renaming because property should have camel casing, but attribute should not
    @Input('min-pixel-width') public set minPixelWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'minPixelWidth', toNullableNumberProperty(value));
    }

    public get groupIndex(): number | null | undefined {
        return this.elementRef.nativeElement.groupIndex;
    }

    // Renaming because property should have camel casing, but attribute should not
    @Input('group-index') public set groupIndex(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupIndex', toNullableNumberProperty(value));
    }

    public get groupingDisabled(): boolean {
        return this.elementRef.nativeElement.groupingDisabled;
    }

    // Renaming because property should have camel casing, but attribute should not
    @Input('grouping-disabled') public set groupingDisabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupingDisabled', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnText>) {
        super(renderer, elementRef);
    }
}
