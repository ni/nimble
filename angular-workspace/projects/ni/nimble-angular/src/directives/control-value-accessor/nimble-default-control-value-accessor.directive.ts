import { Directive, forwardRef } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

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
        useExisting: forwardRef(() => NimbleDefaultControlValueAccessor),
        multi: true
    }]
})
export class NimbleDefaultControlValueAccessor extends DefaultValueAccessor {}