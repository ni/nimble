import { Directive, forwardRef } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Angular form value accessor for the FV text field. */
@Directive({
    selector: 'ok-fv-text-field[formControlName],ok-fv-text-field[formControl],ok-fv-text-field[ngModel]',
    host: {
        /* eslint-disable @typescript-eslint/naming-convention */
        '(input)': '$any(this)._handleInput($any($event.target).value)',
        '(blur)': 'onTouched()',
        '(compositionstart)': '$any(this)._compositionStart()',
        '(compositionend)': '$any(this)._compositionEnd($any($event.target).value)'
        /* eslint-enable @typescript-eslint/naming-convention */
    },
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OkFvTextFieldValueAccessor), multi: true }],
    standalone: false
})
export class OkFvTextFieldValueAccessor extends DefaultValueAccessor {}
