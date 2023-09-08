import { AfterViewChecked, Directive, ElementRef, forwardRef, HostListener, Input, Renderer2 } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ListOption } from '@ni/nimble-components/dist/esm/list-option';
import type { Combobox } from '../../public-api';

/**
* @description
* This symbol instance will be returned when the value input of the Combobox is set
* to a value not found in the set of options.
*/
export const OPTION_NOT_FOUND: unique symbol = Symbol('not found');
export type OptionNotFound = typeof OPTION_NOT_FOUND;

/**
 * Control Value Accessor implementation to target combobox inputs.
 * @description
 * The expectation when binding value via 'ngModel', is that the content in each list-option be
 * unique. When this isn't the case the behavior is undefined. Additionally, it is expected
 * that when using 'ngModel' that each list-option bind a value via 'ngValue', and not 'value'.
 */
@Directive({
    selector:
      'nimble-combobox[formControlName],nimble-combobox[formControl],nimble-combobox[ngModel]',
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleComboboxControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleComboboxControlValueAccessorDirective implements ControlValueAccessor, AfterViewChecked {
    /**
     * @description
     * Tracks the option comparison algorithm for tracking identities when
     * checking for changes.
     */
    @Input()
    public set compareWith(fn: (o1: unknown, o2: unknown) => boolean) {
        if (typeof fn !== 'function') {
            throw new Error(`compareWith must be a function, but received ${JSON.stringify(fn)}`);
        }
        this._compareWith = fn;
    }

    private readonly _displayTextToOptionsMap: Map<string, ListOption[]> = new Map<string, ListOption[]>();
    private readonly _optionToModelValueMap: Map<ListOption, unknown> = new Map<ListOption, unknown>();

    private _modelValue: unknown;

    private _optionUpdateQueue: { listOption: ListOption, modelValue: unknown }[] = [];

    private _compareWith: (o1: unknown, o2: unknown) => boolean = Object.is;

    /**
     * The registered callback function called when a change or input event occurs on the input
     * element.
     * @nodoc
     */
    @HostListener('input', ['$event.target.control.value]'])
    @HostListener('change', ['$event.target.value]'])
    private onChange: (_: string) => void;

    /**
      * The registered callback function called when a blur event occurs on the input element.
      * @nodoc
      */
    @HostListener('blur')
    private onTouched: () => void;

    private readonly observer: MutationObserver;

    public constructor(private readonly _renderer: Renderer2, private readonly _elementRef: ElementRef) {
        this.observer = new MutationObserver(this.mutationCallback);
        this.observer.observe((this._elementRef.nativeElement as HTMLElement), { subtree: true, childList: true, characterData: true });
    }

    public ngAfterViewChecked(): void {
        for (const updateValue of this._optionUpdateQueue) {
            this.addOption(updateValue.listOption.text, updateValue.modelValue, updateValue.listOption);
        }
        this._optionUpdateQueue = [];
    }

    /**
     * Updates the underlying nimble-combobox value with the expected display string.
     * @param value The ngValue set on the nimble-combobox
     */
    public writeValue(value: unknown): void {
        this._modelValue = value;
        this.updateDisplayValue();
    }

    /**
     * Registers a function called when the control value changes.
     * @nodoc
     */
    public registerOnChange(fn: (value: unknown) => void): void {
        this.onChange = (valueString: string): void => {
            const options = this._displayTextToOptionsMap.get(valueString);
            this._modelValue = options
                ? this._optionToModelValueMap.get(options[0])
                : OPTION_NOT_FOUND;
            fn(this._modelValue);
        };
    }

    /**
     * Registers a function called when the control is touched.
     * @nodoc
     */
    public registerOnTouched(fn: () => void): void {
        this.onTouched = fn;
    }

    /**
     * @description
     * Function that is called by the forms API when the control status changes to
     * or from 'DISABLED'. Depending on the status, it enables or disables the
     * combobox.
     * @param isDisabled The disabled status to set on the combobox
     */
    public setDisabledState(isDisabled: boolean): void {
        this.setProperty('disabled', isDisabled);
    }

    /**
     * @internal
     */
    public addOption(displayValue: string, modelValue: unknown, option: ListOption): void {
        this._optionToModelValueMap.set(option, modelValue);
        const options = this._displayTextToOptionsMap.get(displayValue);
        if (options) {
            options.push(option);
        } else {
            this._displayTextToOptionsMap.set(displayValue, [option]);
        }
        this.updateDisplayValue();
    }

    /**
     * @internal
     */
    public removeOption(displayValue: string, option: ListOption): void {
        const options = this._displayTextToOptionsMap.get(displayValue);
        if (options) {
            if (options.length > 1) {
                const removeIndex = options.indexOf(option);
                if (removeIndex >= 0) {
                    options.splice(removeIndex, 1);
                }
            } else {
                this._displayTextToOptionsMap.delete(displayValue);
            }
        }
        this._optionToModelValueMap.delete(option);
    }

    public updateOption(modelValue: unknown, option: ListOption): void {
        this._optionToModelValueMap.set(option, modelValue);
        this.updateDisplayValue();
    }

    public queueOptionUpdate(listOption: ListOption, modelValue: unknown): void {
        this.removeOption(listOption.text, listOption);
        this._optionUpdateQueue.push({ listOption, modelValue });
    }

    private refreshDisplayTextOptions(): void {
        this._displayTextToOptionsMap.clear();
        const options = Array.from((this._elementRef.nativeElement as Combobox).querySelectorAll('nimble-list-option'));
        for (const option of options) {
            const displayTextOptions = this._displayTextToOptionsMap.get(option.text);
            if (!displayTextOptions) {
                this._displayTextToOptionsMap.set(option.text, [option]);
            } else {
                displayTextOptions.push(option);
            }
        }
    }

    private updateDisplayValue(): void {
        const valueAsString = this.getValueStringFromValue(this._modelValue);
        this.setProperty('value', valueAsString ?? '');
    }

    private getValueStringFromValue(value: unknown): string | undefined {
        for (const [option, modelValue] of this._optionToModelValueMap.entries()) {
            if (this._compareWith(modelValue, value)) {
                for (const [displayText, options] of this._displayTextToOptionsMap.entries()) {
                    if (options.includes(option)) {
                        return displayText;
                    }
                }
            }
        }
        return undefined;
    }

    /**
     * Helper method that sets a property on a target element using the current Renderer
     * implementation.
     * @nodoc
     */
    private setProperty(key: string, value: unknown): void {
        this._renderer.setProperty(this._elementRef.nativeElement, key, value);
    }

    private readonly mutationCallback = (mutations: MutationRecord[]): void => {
        const optionTextUpdate = mutations.find(mutation => {
            return ((mutation.type === 'characterData' && mutation.target.parentElement instanceof ListOption)
                || (mutation.type === 'childList' && mutation.target instanceof ListOption));
        });
        if (optionTextUpdate) {
            this.refreshDisplayTextOptions();
        }
    };
}
