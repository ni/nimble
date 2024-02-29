import { Directive, ElementRef, Host, Inject, Optional, Renderer2 } from '@angular/core';
import type { ListOption } from '@ni/nimble-components/dist/esm/list-option';
import { NimbleSelectControlValueAccessorDirective } from '../select/nimble-select-control-value-accessor.directive';
import { NgSelectOption } from '../../thirdparty/directives/select_control_value_accessor';

/**
 * Directive to provide Angular integration for the list option when used with a select.
 */
@Directive({
    selector: 'nimble-list-option'
})
export class NimbleSelectListOptionDirective extends NgSelectOption {
    public constructor(
        elementRef: ElementRef<ListOption>,
        renderer: Renderer2,
        @Inject(NimbleSelectControlValueAccessorDirective) @Optional() @Host() select: NimbleSelectControlValueAccessorDirective
    ) {
        super(elementRef, renderer, select);
    }
}