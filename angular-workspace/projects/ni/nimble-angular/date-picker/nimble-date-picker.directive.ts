import { Directive } from '@angular/core';
import { type DatePicker, datePickerTag } from '@ni/nimble-components/dist/esm/date-picker';

export type { DatePicker };
export { datePickerTag };

/**
 * Directive to provide Angular integration for the table element.
 */
@Directive({
    selector: 'nimble-date-picker'
})
export class NimbleDatePickerDirective {
}
