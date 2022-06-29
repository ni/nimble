/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Directive, ElementRef, Host, Inject, Input, Optional, Renderer2 } from '@angular/core';
import { NgSelectOption } from '@angular/forms';
import type { ListOption } from '@ni/nimble-components/dist/esm/list-option';
import { NimbleComboboxControlValueAccessorDirective } from '../combobox/nimble-combobox-control-value-accessor.directive';
import { NimbleSelectControlValueAccessorDirective } from '../select/nimble-select-control-value-accessor.directive';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

export type { ListOption };

/**
 * Directive to provide Angular integration for the list option.
 */
@Directive({
    selector: 'nimble-list-option'
})
export class NimbleListOptionDirective extends NgSelectOption {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    public constructor(
        private readonly elementRef: ElementRef<ListOption>,
        private readonly renderer: Renderer2,
        @Inject(NimbleSelectControlValueAccessorDirective) @Optional() @Host() private readonly select: NimbleSelectControlValueAccessorDirective,
        @Inject(NimbleComboboxControlValueAccessorDirective) @Optional() @Host() private readonly combobox: NimbleComboboxControlValueAccessorDirective
    ) {
        super(elementRef, renderer, select);
    }

    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('ngValue')
    public set ngValue(value: unknown) {
        if (this.select) {
            super.ngValue = value;
            return;
        }

        if (this.combobox.displayWith) {
            const valueString = this.combobox.displayWith(value);
            this._setElementValue(valueString);
            this.combobox._optionMap.set(valueString, value);
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
        if (this.select) {
            super.value = value;
            return;
        }

        this._setElementValue(value as string);
    }

    /** @internal */
    private _setElementValue(value: string): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }
}
