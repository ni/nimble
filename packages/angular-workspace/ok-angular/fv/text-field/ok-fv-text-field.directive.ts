import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { fvTextFieldTag, type FvTextField, type MaskitoOptions } from '@ni/ok-components/dist/esm/fv/text-field';
import { type BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

export type { FvTextField, MaskitoOptions };
export { fvTextFieldTag };

/** Angular bindings for the FV text field. */
@Directive({
    selector: 'ok-fv-text-field',
    standalone: false
})
export class OkFvTextFieldDirective {
    @Input() public set maskOptions(value: MaskitoOptions | undefined) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'maskOptions', value);
    }

    @Input() public set value(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }

    @Input() public set placeholder(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'placeholder', value);
    }

    @Input() public set type(value: string) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    @Input() public set readOnly(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'readOnly', toBooleanProperty(value));
    }

    @Input() public set required(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'required', toBooleanProperty(value));
    }

    public constructor(
        private readonly elementRef: ElementRef<FvTextField>,
        private readonly renderer: Renderer2
    ) {}
}
