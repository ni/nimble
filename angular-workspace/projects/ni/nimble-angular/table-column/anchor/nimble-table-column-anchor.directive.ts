import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type TableColumnAnchor, tableColumnAnchorTag } from '@ni/nimble-components/dist/esm/table-column/anchor';
import { AnchorAppearance } from '@ni/nimble-components/dist/esm/anchor/types';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective } from '@ni/nimble-angular/table-column';

export type { TableColumnAnchor };
export { tableColumnAnchorTag };
export { AnchorAppearance };

/**
 * Directive to provide Angular integration for the table column element for links.
 */
@Directive({
    selector: 'nimble-table-column-anchor'
})
export class NimbleTableColumnAnchorDirective extends NimbleTableColumnBaseDirective<TableColumnAnchor> {
    public get labelFieldName(): string | undefined {
        return this.elementRef.nativeElement.labelFieldName;
    }

    @Input('label-field-name') public set labelFieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'labelFieldName', value);
    }

    public get hrefFieldName(): string | undefined {
        return this.elementRef.nativeElement.hrefFieldName;
    }

    @Input('href-field-name') public set hrefFieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'hrefFieldName', value);
    }

    public get appearance(): AnchorAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: AnchorAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get underlineHidden(): boolean {
        return this.elementRef.nativeElement.underlineHidden;
    }

    @Input('underline-hidden') public set underlineHidden(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'underlineHidden', toBooleanProperty(value));
    }

    public get hreflang(): string | undefined {
        return this.elementRef.nativeElement.hreflang;
    }

    @Input() public set hreflang(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'hreflang', value);
    }

    public get ping(): string | undefined {
        return this.elementRef.nativeElement.ping;
    }

    @Input() public set ping(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'ping', value);
    }

    public get referrerpolicy(): string | undefined {
        return this.elementRef.nativeElement.referrerpolicy;
    }

    @Input() public set referrerpolicy(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'referrerpolicy', value);
    }

    public get rel(): string | undefined {
        return this.elementRef.nativeElement.rel;
    }

    @Input() public set rel(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'rel', value);
    }

    public get target(): string | undefined {
        return this.elementRef.nativeElement.target;
    }

    @Input() public set target(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'target', value);
    }

    public get type(): string | undefined {
        return this.elementRef.nativeElement.type;
    }

    @Input() public set type(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
    }

    public get download(): string | undefined {
        return this.elementRef.nativeElement.download;
    }

    @Input() public set download(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'download', value);
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

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnAnchor>) {
        super(renderer, elementRef);
    }
}
