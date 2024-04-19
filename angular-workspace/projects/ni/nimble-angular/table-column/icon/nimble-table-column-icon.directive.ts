import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type TableColumnIcon, tableColumnIconTag } from '@ni/nimble-components/dist/esm/table-column/icon';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective } from '@ni/nimble-angular/table-column';
import type { MappingKeyType } from '@ni/nimble-components/dist/esm/table-column/enum-base/types';

export type { TableColumnIcon };
export { tableColumnIconTag };

/**
 * Directive to provide Angular integration for the table column element for icons/spinners.
 */
@Directive({
    selector: 'nimble-table-column-icon'
})
export class NimbleTableColumnIconDirective extends NimbleTableColumnBaseDirective<TableColumnIcon> {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
    }

    public get keyType(): MappingKeyType {
        return this.elementRef.nativeElement.keyType;
    }

    @Input('key-type') public set keyType(value: MappingKeyType) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'keyType', value);
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

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnIcon>) {
        super(renderer, elementRef);
    }
}
