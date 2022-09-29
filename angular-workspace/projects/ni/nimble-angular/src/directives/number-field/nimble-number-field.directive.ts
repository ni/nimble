import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { NumberField } from '@ni/nimble-components/dist/esm/number-field';
import { NumberFieldAppearance } from '@ni/nimble-components/dist/esm/number-field/types';
import { BooleanValueOrAttribute, NumberValueOrAttribute, toBooleanProperty, toNumberProperty } from '../utilities/template-value-helpers';

export type { NumberField };
export { NumberFieldAppearance };

/**
 * Directive to provide Angular integration for the number field.
 */
@Directive({
    selector: 'nimble-number-field'
})
export class NimbleNumberFieldDirective {
    public get appearance(): NumberFieldAppearance {
        return this.elementRef.nativeElement.appearance;
    }

    @Input() public set appearance(value: NumberFieldAppearance) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearance', value);
    }

    public get readOnly(): boolean {
        return this.elementRef.nativeElement.readOnly;
    }

    // readOnly property maps to the readonly attribute
    // https://github.com/microsoft/fast/blob/46bb6d9aab2c37105f4434db3795e176c2354a4f/packages/web-components/fast-foundation/src/number-field/number-field.ts#L38
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('readonly') public set readOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', toBooleanProperty(value));
    }

    public get min(): number {
        return this.elementRef.nativeElement.min;
    }

    @Input() public set min(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'min', toNumberProperty(value));
    }

    public get max(): number {
        return this.elementRef.nativeElement.max;
    }

    @Input() public set max(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'max', toNumberProperty(value));
    }

    public get step(): number {
        return this.elementRef.nativeElement.step;
    }

    @Input() public set step(value: NumberValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'step', toNumberProperty(value));
    }

    public get placeholder(): string {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input() public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public get errorText(): string | undefined {
        return this.elementRef.nativeElement.errorText;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-text') public set errorText(value: string | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorText', value);
    }

    public get errorVisible(): boolean {
        return this.elementRef.nativeElement.errorVisible;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('error-visible') public set errorVisible(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'errorVisible', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<NumberField>) {}
}
