import { Directive } from '@angular/core';
import { NimbleComboboxListOptionDirective } from '../list-option/nimble-combobox-list-option.directive';

/**
 * Directive to provide Angular integration for the list option when used with a combobox.
 */
@Directive({
    selector: 'nimble-rich-content-list-option'
})
export class NimbleComboboxRichContentListOptionDirective extends NimbleComboboxListOptionDirective {}