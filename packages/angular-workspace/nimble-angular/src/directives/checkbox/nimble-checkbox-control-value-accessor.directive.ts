import { Directive, forwardRef, HostListener } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { CheckboxControlValueAccessor } from '../../thirdparty/directives/checkbox_value_accessor';
import type { Checkbox } from './nimble-checkbox.directive';

/**
 * Extension of Angular's CheckboxControlValueAccessor to target the Nimble checkbox control.
 *
 * Directive decorator based on CheckboxControlValueAccessor decorator in thirdparty/directives/checkbox_value_accessor
 */
@Directive({
    selector: 'nimble-checkbox[formControlName],nimble-checkbox[formControl],nimble-checkbox[ngModel]',
    // The following host metadata is duplicated from CheckboxControlValueAccessor
    // eslint-disable-next-line @angular-eslint/no-host-metadata-property, @typescript-eslint/naming-convention
    host: { '(blur)': 'onTouched()' },
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => NimbleCheckboxControlValueAccessorDirective),
        multi: true
    }],
    standalone: false
})
export class NimbleCheckboxControlValueAccessorDirective extends CheckboxControlValueAccessor {
    private ignoreChangeEvents = false;

    public override writeValue(value: unknown): void {
        // Because the 'change' event is emitted from the checkbox when its value is set programmatically,
        // ignore change events while writing the value. See https://github.com/ni/nimble/issues/2739
        try {
            this.ignoreChangeEvents = true;
            super.writeValue(value);
        } finally {
            this.ignoreChangeEvents = false;
        }
    }

    @HostListener('change', ['$event'])
    public nimbleOnChange(event: Event): void {
        if (this.ignoreChangeEvents) {
            return;
        }
        this.onChange((event.target as Checkbox).checked);
    }
}
