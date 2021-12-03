import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { TextField } from '@ni/nimble-components/dist/esm/text-field';
import { toBooleanProperty } from '../utilities/template-value-helpers';

/**
 * Directive to provide Angular integration for the text field
 */
@Directive({
    selector: 'nimble-text-field'
})
export class NimbleTextFieldDirective {
    public get readOnly(): boolean {
        return this.el.nativeElement.readOnly;
    }

    @Input() public set readOnly(value: boolean) {
        this.renderer.setProperty(this.el.nativeElement, 'readOnly', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly el: ElementRef<TextField>) {}
}
