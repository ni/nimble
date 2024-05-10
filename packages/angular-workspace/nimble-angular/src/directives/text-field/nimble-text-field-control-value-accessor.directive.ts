import { Directive, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { DefaultValueAccessor } from '../../thirdparty/directives/default_value_accessor';

/**
 * Extension of Angular's DefaultValueAccessor to target the text-based inputs.
 *
 * Directive decorator based on DefaultValueAccessor decorator in thirdparty/directives/default_value_accessor
 */
@Directive({
    selector:
        'nimble-text-field[formControlName],nimble-text-field[formControl],nimble-text-field[ngModel]',
    // The following host metadata is duplicated from DefaultValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property
    host: {
        /* eslint-disable @typescript-eslint/naming-convention */
        '(input)': '$any(this)._handleInput($event.target.value)',
        '(blur)': 'onTouched()',
        '(compositionstart)': '$any(this)._compositionStart()',
        '(compositionend)': '$any(this)._compositionEnd($event.target.value)'
        /* eslint-enable @typescript-eslint/naming-convention */
    },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleTextFieldControlValueAccessorDirective),
        multi: true
    }]
})
export class NimbleTextFieldControlValueAccessorDirective extends DefaultValueAccessor { }
