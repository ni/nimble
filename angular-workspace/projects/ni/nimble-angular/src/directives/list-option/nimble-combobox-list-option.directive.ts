/* The following disabled rules are needed to indicate that the 'combobox' constructor parameter is allowed to be null */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { Directive, ElementRef, Host, Inject, Input, Optional, Renderer2, AfterViewInit, OnDestroy } from '@angular/core';
import { NgSelectOption } from '@angular/forms';
import type { ListOption } from '@ni/nimble-components/dist/esm/list-option';
import { NimbleComboboxControlValueAccessorDirective } from '../combobox/nimble-combobox-control-value-accessor.directive';
import { BooleanValueOrAttribute, toBooleanProperty } from '../utilities/template-value-helpers';

/**
 * Directive to provide Angular integration for the list option when used with a combobox.
 */
@Directive({
    selector: 'nimble-list-option'
})
export class NimbleComboboxListOptionDirective extends NgSelectOption implements AfterViewInit, OnDestroy {
    public get disabled(): boolean {
        return this.elementRef.nativeElement.disabled;
    }

    @Input() public set disabled(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'disabled', toBooleanProperty(value));
    }

    /**
     * @description
     * Tracks the value bound to the option element. Unlike the value binding,
     * ngValue supports binding to objects.
     */
    @Input()
    public set ngValue(value: unknown) {
        if (this.combobox) {
            this._value = value;
            this.updateComboboxValue(value);
        }
    }

    /**
      * @description
      * Tracks simple string values bound to the option element.
      * For objects, use the `ngValue` input binding.
      */
    @Input()
    public set value(value: unknown) {
        if (this.combobox) {
            if (this._currentValueString) {
                this.combobox._optionMap.delete(this._currentValueString);
            }
            this._currentValueString = value as string;
            // it's necessary to update the _optionMap on the combobox value accessor even when the values are just strings
            this.updateComboboxValue(this._currentValueString);
        }
    }

    private _value: unknown;

    private _currentValueString: string | undefined = undefined;

    public constructor(
        private readonly elementRef: ElementRef<ListOption>,
        private readonly renderer: Renderer2,
        @Inject(NimbleComboboxControlValueAccessorDirective) @Optional() @Host() private readonly combobox: NimbleComboboxControlValueAccessorDirective
    ) {
        // @ts-expect-error The 'select' parameter can indeed be null. Prevents ts(2345).
        super(elementRef, renderer, null);
    }

    public ngAfterViewInit(): void {
        if (this.combobox && this.elementRef.nativeElement.textContent) {
            this._currentValueString = this.elementRef.nativeElement.textContent;
            this.combobox._optionMap.set(this._currentValueString, this._value ?? null);
        }
    }

    public ngOnDestroy(): void {
        if (this.combobox && this._currentValueString) {
            this.combobox._optionMap.delete(this._currentValueString);
        }
    }

    private updateComboboxValue(value: unknown): void {
        const currentValueString = this._currentValueString ?? this.elementRef.nativeElement.textContent;
        this.setElementValue(currentValueString ?? '');
        if (currentValueString) {
            this.combobox._optionMap.set(currentValueString, value);
        }
    }

    private setElementValue(value: string): void {
        this.renderer.setProperty(this.elementRef.nativeElement, 'value', value);
    }
}
