/* eslint-disable max-classes-per-file */
import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NumberValueOrAttribute, toNullableNumberProperty } from '@ni/nimble-angular/internal-utilities';

export interface FractionalWidthColumn {
    fractionalWidth?: number | null;
    minPixelWidth?: number | null;
}

/**
 * TODO
 */
export abstract class FractionalWidthColumnDirectiveBase<T extends FractionalWidthColumn> {
    public renderer: Renderer2;
    public elementRef: ElementRef<T>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type FractionalWidthColumnDirectiveBaseConstructor<T extends FractionalWidthColumn> = abstract new (...args: any[]) => FractionalWidthColumnDirectiveBase<T>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types, @typescript-eslint/explicit-function-return-type
export function mixinFractionalWidthColumnAPI<TBase extends FractionalWidthColumnDirectiveBaseConstructor<FractionalWidthColumn>>(base: TBase) {
    /**
     * TODO
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