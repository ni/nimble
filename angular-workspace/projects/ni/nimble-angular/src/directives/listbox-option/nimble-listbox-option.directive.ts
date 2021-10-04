import { Directive, ElementRef, Host, HostBinding, Input, Optional, Renderer2 } from '@angular/core';
import { NgSelectOption } from '@angular/forms';
import { ListboxOption } from '@ni/nimble-components/dist/esm/listbox-option';
import { NimbleSelectControlValueAccessorDirective } from '../select';

@Directive({
    selector: 'nimble-listbox-option'
})
export class NimbleListboxOptionDirective extends NgSelectOption {
    @HostBinding('attr.disabled') @Input() public disabled: boolean;

    public constructor(
        element: ElementRef<ListboxOption>, renderer: Renderer2,
        @Optional() @Host() select: NimbleSelectControlValueAccessorDirective
    ) {
        super(element, renderer, select);
    }
}
