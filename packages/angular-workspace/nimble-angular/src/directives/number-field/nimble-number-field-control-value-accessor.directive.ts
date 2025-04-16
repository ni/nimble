import { Directive, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { NumberValueAccessor } from '../../thirdparty/directives/number_value_accessor';

/**
 * Extension of Angular's NumberValueAccessor to target the number-based inputs.
 *
 * Directive decorator based on NumberValueAccessor decorator in thirdparty/directives/number_value_accessor
 */
@Directive({
    selector:
        'nimble-number-field[formControlName],nimble-number-field[formControl],nimble-number-field[ngModel]',
    // The following host metadata is duplicated from NumberValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { '(input)': 'onChange($event.target.value)', '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleNumberFieldControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleNumberFieldControlValueAccessorDirective extends NumberValueAccessor {
    @Input('readonly-when-disabled') public readonlyWhenDisabled: boolean;

    public override setDisabledState(isDisabled: boolean): void {
        if (this.readonlyWhenDisabled) {
            this.setProperty('readonly', isDisabled);
        } else {
            super.setDisabledState(isDisabled);
        }
    }
}
