import { Directive, forwardRef } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Angular form value accessor for the FV date-time picker. */
@Directive({
    selector: 'ok-fv-date-time-picker[formControlName],ok-fv-date-time-picker[formControl],ok-fv-date-time-picker[ngModel]',
    host: {
        /* eslint-disable @typescript-eslint/naming-convention */
        '(input)': '$any(this)._handleInput($any($event.target).value)',
        '(blur)': 'onTouched()',
        '(compositionstart)': '$any(this)._compositionStart()',
        '(compositionend)': '$any(this)._compositionEnd($any($event.target).value)'
        /* eslint-enable @typescript-eslint/naming-convention */
    },
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OkFvDateTimePickerValueAccessor), multi: true }],
    standalone: false
})
export class OkFvDateTimePickerValueAccessor extends DefaultValueAccessor {}
