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

    public get placeholder(): string | undefined {
        return this.elementRef.nativeElement.placeholder;
    }

    public set placeholder(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get fractionalWidth(): number {
        return this.elementRef.nativeElement.fractionalWidth;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('fractional-width') public set fractionalWidth(value: number) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fractionalWidth', value);
    }

    public get minPixelWidth(): number | null {
        return this.elementRef.nativeElement.minPixelWidth;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('min-pixel-width') public set minPixelWidth(value: number | null) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'minPixelWidth', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<TableColumnText>) {}
}
