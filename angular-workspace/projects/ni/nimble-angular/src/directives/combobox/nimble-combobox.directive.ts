import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import type { Combobox } from '@ni/nimble-components/dist/esm/combobox';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { Combobox };

/**
 * Directive for Nimble combobox control Angular integration
 */
@Directive({
    selector: 'nimble-combobox',
})
export class NimbleComboboxDirective {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(private readonly renderer: Renderer2, private readonly elementRef: ElementRef<Combobox>) {}
}
