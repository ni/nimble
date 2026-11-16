import { Directive, forwardRef } from '@angular/core';
import { DefaultValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

/** Angular form value accessor for the FV text field. */
@Directive({
    selector: 'ok-fv-text-field[formControlName],ok-fv-text-field[formControl],ok-fv-text-field[ngModel]',
    providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => OkFvTextFieldValueAccessor), multi: true }],
    standalone: false
})
export class OkFvTextFieldValueAccessor extends DefaultValueAccessor {}
