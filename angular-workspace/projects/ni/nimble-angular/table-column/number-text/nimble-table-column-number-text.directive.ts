import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NumberValueOrAttribute, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective, mixinFractionalWidthColumnAPI, mixinGroupableColumnAPI } from '@ni/nimble-angular/table-column';
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
export class NimbleTableColumnNumberTextDirective extends mixinFractionalWidthColumnAPI(mixinGroupableColumnAPI(NimbleTableColumnBaseDirective<TableColumnNumberText>)) {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
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

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('decimal-digits') public set decimalDigits(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'decimalDigits', toNullableNumberProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnNumberText>) {
        super(renderer, elementRef);
    }
}
