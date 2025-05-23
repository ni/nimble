import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type TableColumnDurationText, tableColumnDurationTextTag } from '@ni/nimble-components/dist/esm/table-column/duration-text';
import { type BooleanValueOrAttribute, type NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective, TableColumnSortDirection } from '@ni/nimble-angular/table-column';

export type { TableColumnDurationText };
export { tableColumnDurationTextTag };

/**
 * Directive to provide Angular integration for the table column element for duration text.
 */
@Directive({
    selector: 'nimble-table-column-duration-text'
})
export class NimbleTableColumnDurationTextDirective extends NimbleTableColumnBaseDirective<TableColumnDurationText> {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
    }

    public get placeholder(): string | undefined {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input() public set placeholder(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
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

    public get sortingDisabled(): boolean {
        return this.elementRef.nativeElement.sortingDisabled;
    }

    @Input('sorting-disabled') public set sortingDisabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'sortingDisabled', toBooleanProperty(value));
    }

    public get sortDirection(): TableColumnSortDirection {
        return this.elementRef.nativeElement.sortDirection;
    }

    @Input('sort-direction') public set sortDirection(value: TableColumnSortDirection) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'sortDirection', value);
    }

    public get sortIndex(): number | null | undefined {
        return this.elementRef.nativeElement.sortIndex;
    }

    @Input('sort-index') public set sortIndex(value: NumberValueOrAttribute | null | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'sortIndex', toNullableNumberProperty(value));
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnDurationText>) {
        super(renderer, elementRef);
    }
}
