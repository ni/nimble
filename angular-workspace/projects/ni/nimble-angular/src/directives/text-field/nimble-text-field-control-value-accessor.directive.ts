/* eslint-disable */
import { Directive, ElementRef, forwardRef, Inject, Optional, Renderer2 } from '@angular/core';
import { COMPOSITION_BUFFER_MODE, DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Directive({
    selector:
        'nimble-text-field[formControlName],nimble-text-field[formControl],nimble-text-field[ngModel]',
    host: {
        '(input)': '$any(this)._handleInput($event.target.value)',
        '(blur)': 'onTouched()',
        '(compositionstart)': '$any(this)._compositionStart()',
        '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleTextFieldControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleTextFieldControlValueAccessorDirective {
    public constructor(
        renderer: Renderer2,
        elementRef: ElementRef,
        @Optional() @Inject(COMPOSITION_BUFFER_MODE) _compositionMode: boolean
    ) {
        const defaultValueAccessor = new DefaultValueAccessor(renderer, elementRef, _compositionMode);
        const proxy = new Proxy(defaultValueAccessor, {
            getPrototypeOf() {
                return NimbleTextFieldControlValueAccessorDirective.prototype
            }
        });
        return proxy;
    }
}
