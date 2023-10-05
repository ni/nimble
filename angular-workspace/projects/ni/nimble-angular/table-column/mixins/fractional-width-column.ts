import { Directive, Input } from '@angular/core';
import { NumberValueOrAttribute, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';
import type { TableColumn } from '@ni/nimble-components/dist/esm/table-column/base';
import type { NimbleTableColumnBaseDirective } from '../nimble-table-column-base.directive';

type FractionalWidthColumn = TableColumn & {
    fractionalWidth?: number | null,
    minPixelWidth?: number | null
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FractionalWidthColumnDirectiveConstructor<T extends FractionalWidthColumn> = abstract new (...args: any[]) => NimbleTableColumnBaseDirective<T>;

// As the returned class is internal to the function, we can't write a signature that uses is directly, so rely on inference
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinFractionalWidthColumnAPI<TBase extends FractionalWidthColumnDirectiveConstructor<FractionalWidthColumn>>(base: TBase) {
    /**
     * The Mixin that provides a concrete column directive with the API to support being resized
     * proportionally within a Table.
     */
    @Directive()
    abstract class FractionalWidthColumnDirective extends base {
        public get fractionalWidth(): number | null | undefined {
            return this.elementRef.nativeElement.fractionalWidth;
        }

        // Renaming because property should have camel casing, but attribute should not
        // eslint-disable-next-line @angular-eslint/no-input-rename
        @Input('fractional-width') public set fractionalWidth(value: NumberValueOrAttribute | null | undefined) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'fractionalWidth', toNullableNumberProperty(value));
        }

        public get minPixelWidth(): number | null | undefined {
            return this.elementRef.nativeElement.minPixelWidth;
        }

        // Renaming because property should have camel casing, but attribute should not
        // eslint-disable-next-line @angular-eslint/no-input-rename
        @Input('min-pixel-width') public set minPixelWidth(value: NumberValueOrAttribute | null | undefined) {
            this.renderer.setProperty(this.elementRef.nativeElement, 'minPixelWidth', toNullableNumberProperty(value));
        }
    }
    return FractionalWidthColumnDirective;
}