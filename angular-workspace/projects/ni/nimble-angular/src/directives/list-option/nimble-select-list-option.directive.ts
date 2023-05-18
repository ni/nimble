import { Directive, ElementRef, Host, Inject, Input, Optional, Renderer2 } from '@angular/core';
import { NgSelectOption } from '@angular/forms';
import type { ListOption } from '@ni/nimble-components/dist/esm/list-option';
import { NimbleSelectControlValueAccessorDirective } from '../select/nimble-select-control-value-accessor.directive';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';

/**
 * Directive to provide Angular integration for the list option when used with a select.
 */
@Directive({
    selector: 'nimble-list-option'
})
export class NimbleSelectListOptionDirective extends NgSelectOption {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(
        private readonly elementRef: ElementRef<ListOption>,
        private readonly renderer: Renderer2,
        @Inject(NimbleSelectControlValueAccessorDirective) @Optional() @Host() select: NimbleSelectControlValueAccessorDirective
    ) {
        super(elementRef, renderer, select);
    }
}