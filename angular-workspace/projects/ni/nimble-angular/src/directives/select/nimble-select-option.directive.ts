import { Directive, ElementRef, Renderer2, Optional, Host } from '@angular/core';
import { NgSelectOption } from '@angular/forms';
import { ListboxOption } from '@ni/nimble-components/dist/esm/listbox-option';
import { NimbleSelectControlValueAccessor } from './nimble-select-control-value-accessor.directive';

// Disable eslint rules related to "any" types, the select control uses them to allow values of any type
/* eslint-disable @typescript-eslint/explicit-module-boundary-types,
                  @typescript-eslint/no-explicit-any,
                  @typescript-eslint/restrict-template-expressions,
                  @typescript-eslint/no-unsafe-assignment */

/**
 * Extension of Angular's NgSelectOption to target the Nimble listbox option.
 *
 * Overrides [value] and [ngValue] setters to set "value" attribute on option element, and to coerce
 * [value] values to strings.
 *
 * @see NimbleSelectControlValueAccessor
 */
@Directive({ selector: 'nimble-listbox-option' })
export class NimbleSelectOptionDirective extends NgSelectOption {
    public constructor(
        private readonly element: ElementRef<ListboxOption>, private readonly renderer: Renderer2,
        @Optional() @Host() private readonly select: NimbleSelectControlValueAccessor
    ) {
        super(element, renderer, select);
    }

    public override set value(value: any) {
        const valueAsString = `${value}`;
        super.value = valueAsString;
        this.renderer.setAttribute(this.element.nativeElement, 'value', valueAsString);
    }

    public override set ngValue(value: any) {
        super.ngValue = value;
        if (this.select) {
            this.renderer.setAttribute(this.element.nativeElement, 'value', this.element.nativeElement.value);
        }
    }
}
