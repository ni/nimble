import { Directive, forwardRef } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Angular form value accessor for the FV date-time picker. */
@Directive({
    selector: 'ok-fv-date-time-picker[formControlName],ok-fv-date-time-picker[formControl],ok-fv-date-time-picker[ngModel]',
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OkFvDateTimePickerValueAccessor), multi: true }],
    standalone: false
})
export class OkFvDateTimePickerValueAccessor extends DefaultValueAccessor {}
