import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type TableColumnIcon, tableColumnIconTag } from '@ni/nimble-components/dist/esm/table-column/icon';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleTableColumnBaseDirective, mixinFractionalWidthColumnAPI, mixinGroupableColumnAPI } from '@ni/nimble-angular/table-column';
import type { MappingKeyType } from '@ni/nimble-components/dist/esm/table-column/enum-base/types';

export type { TableColumnIcon };
export { tableColumnIconTag };

/**
 * Directive to provide Angular integration for the table column element for icons/spinners.
 */
@Directive({
    selector: 'nimble-table-column-icon'
})
export class NimbleTableColumnIconDirective extends mixinFractionalWidthColumnAPI(mixinGroupableColumnAPI(NimbleTableColumnBaseDirective<TableColumnIcon>)) {
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

    public constructor(renderer: Renderer2, elementRef: ElementRef<TableColumnIcon>) {
        super(renderer, elementRef);
    }
}
