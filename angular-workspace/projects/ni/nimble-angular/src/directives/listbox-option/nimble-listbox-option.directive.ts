import { Directive, ElementRef, Host, Input, Optional, Renderer2 } from '@angular/core';
import { NgSelectOption } from '@angular/forms';
import { ListboxOption } from '@ni/nimble-components/dist/esm/listbox-option';
import { NimbleSelectControlValueAccessorDirective } from '../select/nimble-select-control-value-accessor.directive';
import { toBooleanProperty } from '../utilities/template-value-helpers';

/**
 * Directive to provide Angular integration for the listbox option.
 */
@Directive({
    selector: 'nimble-listbox-option'
})
export class NimbleListboxOptionDirective extends NgSelectOption {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: boolean) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(
        private readonly elementRef: ElementRef<ListboxOption>,
        private readonly renderer: Renderer2,
        @Optional() @Host() select: NimbleSelectControlValueAccessorDirective
    ) {
        super(elementRef, renderer, select);
    }
}
