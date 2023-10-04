import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type TableColumnEnumText, tableColumnEnumTextTag } from '@ni/nimble-components/dist/esm/table-column/enum-text';
import { NimbleTableColumnBaseDirective, mixinFractionalWidthColumnAPI, mixinGroupableColumnAPI } from '@ni/nimble-angular/table-column';
import { MappingKeyType } from '@ni/nimble-components/dist/esm/table-column/enum-base/types';

export { MappingKeyType };
export type { TableColumnEnumText };
export { tableColumnEnumTextTag };

/**
 * Directive to provide Angular integration for the table column element for enum text.
 */
@Directive({
    selector: 'nimble-table-column-enum-text'
})
export class NimbleTableColumnEnumTextDirective extends mixinFractionalWidthColumnAPI(mixinGroupableColumnAPI(NimbleTableColumnBaseDirective<TableColumnEnumText>)) {
    public get fieldName(): string | undefined {
        return this.elementRef.nativeElement.fieldName;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('field-name') public set fieldName(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'fieldName', value);
    }

    public get keyType(): MappingKeyType {
        return this.elementRef.nativeElement.keyType;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('key-type') public set keyType(value: MappingKeyType) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'keyType', value);
    }

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnEnumText>) {
        super(renderer, elementRef);
    }
}
