import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { NumberField } from '@ni/nimble-components/dist/esm/number-field';
import { toBooleanProperty, toNumberProperty } from '../utilities/template-value-helpers';

/**
 * Directive to provide Angular integration for the number field.
 */
@Directive({
    selector: 'nimble-number-field'
})
export class NimbleNumberFieldDirective {
    public get readOnly(): boolean {
        return this.elementRef.nativeElement.readOnly;
    }

    @Input() public set readOnly(value: boolean) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', toBooleanProperty(value));
    }

    public get min(): number {
        return this.elementRef.nativeElement.min;
    }

    @Input() public set min(value: number) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'min', toNumberProperty(value));
    }

    public get max(): number {
        return this.elementRef.nativeElement.max;
    }

    @Input() public set max(value: number) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'max', toNumberProperty(value));
    }

    public get step(): number {
        return this.elementRef.nativeElement.step;
    }

    @Input() public set step(value: number) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'step', toNumberProperty(value));
    }

    public get placeholder(): string {
        return this.elementRef.nativeElement.placeholder;
    }

    @Input() public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<NumberField>) {}
}
