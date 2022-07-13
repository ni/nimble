/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Directive, ElementRef, Host, Inject, Input, Optional, Renderer2 } from '@angular/core';
import { NgSelectOption } from '@angular/forms';
import type { ListOption } from '@ni/nimble-components/dist/esm/list-option';
import { NimbleComboboxControlValueAccessorDirective } from '../combobox/nimble-combobox-control-value-accessor.directive';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

/**
 * Directive to provide Angular integration for the list option.
 */
@Directive({
    selector: 'nimble-list-option'
})
export class NimbleComboboxListOptionDirective extends NgSelectOption {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(
        private readonly elementRef: ElementRef<ListOption>,
        private readonly renderer: Renderer2,
        @Inject(NimbleComboboxControlValueAccessorDirective) @Optional() @Host() private readonly combobox: NimbleComboboxControlValueAccessorDirective
    ) {
        // @ts-expect-error The 'select' parameter can indeed be null
        super(elementRef, renderer, null);
    }

    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('ngValue')
    public set ngValue(value: unknown) {
        if (this.combobox) {
            this.updateComboboxValue(value);
        }
    }

    /**
     * @description
     * Tracks simple string values bound to the option element.
     * For objects, use the `ngValue` input binding.
     */
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('value')
    public set value(value: unknown) {
        if (this.combobox) {
            // it's necessary to update the _optionMap on the combobox value accessor even when the values are just strings
            this.updateComboboxValue(value as string);
        }
    }

    /** @internal */
    private updateComboboxValue(value: unknown): void {
        const valueString = this.combobox.displayWith(value);
        this.setElementValue(valueString);
        this.combobox._optionMap.set(valueString, value);
    }

    /** @internal */
    private setElementValue(value: string): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }
}
