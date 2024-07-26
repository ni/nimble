import { Directive, ElementRef, Host, Inject, Input, Optional, AfterViewInit, OnDestroy } from '@angular/core';
import type { ListOption } from '@ni/nimble-components/dist/esm/list-option';
import { NimbleComboboxControlValueAccessorDirective } from '../combobox/nimble-combobox-control-value-accessor.directive';

/**
 * Directive to provide Angular integration for the list option when used with a combobox.
 */
@Directive({
    selector: 'nimble-list-option'
})
export class NimbleComboboxListOptionDirective implements AfterViewInit, OnDestroy {
    /**
     * @description
     * Tracks the value bound to the option element.
     */
    @Input()
    public set ngValue(value: unknown) {
        if (this.combobox) {
            this._modelValue = value;
            this.updateComboboxValue(value);
        }
    }

    private _modelValue: unknown = undefined;

    public constructor(
        private readonly elementRef: ElementRef<ListOption>,
        @Inject(NimbleComboboxControlValueAccessorDirective) @Optional() @Host() private readonly combobox?: NimbleComboboxControlValueAccessorDirective
    ) { }

    public ngAfterViewInit(): void {
        if (this.combobox) {
            this.combobox.addOption(this._modelValue, this.elementRef.nativeElement);
        }
    }

    public ngOnDestroy(): void {
        if (this.combobox) {
            this.combobox.removeOption(this.elementRef.nativeElement);
        }
    }

    private updateComboboxValue(value: unknown): void {
        this.combobox!.queueOptionUpdate(value, this.elementRef.nativeElement);
    }
}
