import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective } from '@ni/nimble-angular/table-column';
import { type TableColumnNumberText, tableColumnNumberTextTag } from '@ni/nimble-components/dist/esm/table-column/number-text';
import { NumberTextAlignment, NumberTextFormat } from '@ni/nimble-components/dist/esm/table-column/number-text/types';

export type { TableColumnNumberText };
export { tableColumnNumberTextTag, NumberTextFormat, NumberTextAlignment };

/**
 * Directive to provide Angular integration for the table column element for number text.
 */
@Directive({
    selector: 'nimble-table-column-number-text'
})
export class NimbleTableColumnNumberTextDirective extends NimbleTableColumnBaseDirective<TableColumnNumberText> {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
    }

    public get format(): NumberTextFormat {
        return this.elementRef.nativeElement.format;
    }

    @Input() public set format(value: NumberTextFormat) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'format', value);
    }

    public get alignment(): NumberTextAlignment {
        return this.elementRef.nativeElement.alignment;
    }

    @Input() public set alignment(value: NumberTextAlignment) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'alignment', value);
    }

    public get decimalDigits(): number | null | undefined {
        return this.elementRef.nativeElement.decimalDigits;
    }

    @Input('decimal-digits') public set decimalDigits(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'decimalDigits', toNullableNumberProperty(value));
    }

    public get decimalMaximumDigits(): number | null | undefined {
        return this.elementRef.nativeElement.decimalMaximumDigits;
    }

    @Input('decimal-maximum-digits') public set decimalMaximumDigits(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'decimalMaximumDigits', toNullableNumberProperty(value));
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

    @Input('min-pixel-width') public set minPixelWidth(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'minPixelWidth', toNullableNumberProperty(value));
    }

    public get groupIndex(): number | null | undefined {
        return this.elementRef.nativeElement.groupIndex;
    }

    @Input('group-index') public set groupIndex(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupIndex', toNullableNumberProperty(value));
    }

    public get groupingDisabled(): boolean {
        return this.elementRef.nativeElement.groupingDisabled;
    }

    @Input('grouping-disabled') public set groupingDisabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'groupingDisabled', toBooleanProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnNumberText>) {
        super(renderer, elementRef);
    }
}
