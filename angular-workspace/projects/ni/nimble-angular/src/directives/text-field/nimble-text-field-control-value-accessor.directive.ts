/* eslint-disable */
import { Directive, ElementRef, forwardRef, Inject, Optional, Renderer2 } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, ControlValueAccessor, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

type OriginalDefaultValueAccessor = Pick<DefaultValueAccessor, keyof DefaultValueAccessor>;

@Directive({
    selector:
        'nimble-text-field[formControlName],nimble-text-field[formControl],nimble-text-field[ngModel]',
    host: {
        '(input)': '$any(this).defaultValueAccessor._handleInput($event.target.value)',
        '(blur)': 'defaultValueAccessor.onTouched()',
        '(compositionstart)': '$any(this).defaultValueAccessor._compositionStart()',
        '(compositionend)': '$any(this).defaultValueAccessor._compositionEnd($event.target.value)'
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleTextFieldControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleTextFieldControlValueAccessorDirective implements OriginalDefaultValueAccessor {
    private readonly defaultValueAccessor: DefaultValueAccessor;
    public constructor(
        renderer: Renderer2,
        elementRef: ElementRef,
        @Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
    ) {
        this.defaultValueAccessor = new DefaultValueAccessor(renderer, elementRef, _compositionMode);
    }

    set onChange (val: (_: any) => void) {
        this.defaultValueAccessor.onChange = val;
    }

    get onChange(): (_: any) => void {
        return this.defaultValueAccessor.onChange;
    }

    set onTouched (val: () => void) {
        this.defaultValueAccessor.onTouched = val;
    }

    get onTouched(): () => void {
        return this.defaultValueAccessor.onTouched;
    }

    protected setProperty(key: string, value: any): void {
        throw new Error('Method not implemented.');
    }

    public writeValue(obj: any): void {
        this.defaultValueAccessor.writeValue(obj);
    }

    public registerOnChange(fn: (_: any) => {}): void {
        this.defaultValueAccessor.registerOnChange(fn);
    }

    public registerOnTouched(fn: () => void): void {
        this.defaultValueAccessor.registerOnTouched(fn);
    }

    public setDisabledState(isDisabled: boolean): void {
        this.defaultValueAccessor.setDisabledState(isDisabled);
    }
}
