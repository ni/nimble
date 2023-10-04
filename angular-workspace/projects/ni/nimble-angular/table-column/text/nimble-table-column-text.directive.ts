import { Directive, Input } from '@angular/core';
import { type TableColumnText, tableColumnTextTag } from '@ni/nimble-components/dist/esm/table-column/text';
import { NimbleTableColumnBaseDirective, mixinGroupableColumnAPI, mixinFractionalWidthColumnAPI } from '@ni/nimble-angular/table-column';

export type { TableColumnText };
export { tableColumnTextTag };

/**
 * Directive to provide Angular integration for the table column element for text.
 */
@Directive({
    selector: 'nimble-table-column-text'
})
export class NimbleTableColumnTextDirective extends mixinFractionalWidthColumnAPI(mixinGroupableColumnAPI(NimbleTableColumnBaseDirective<TableColumnText>)) {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
    }
}
