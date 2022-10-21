import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleSelectListOptionDirective } from './nimble-select-list-option.directive';
import { NimbleComboboxListOptionDirective } from './nimble-combobox-list-option.directive';

import '@ni/nimble-components/dist/esm/list-option';

@NgModule({
    declarations: [NimbleSelectListOptionDirective, NimbleComboboxListOptionDirective],
    imports: [CommonModule],
    exports: [NimbleSelectListOptionDirective, NimbleComboboxListOptionDirective]
})
export class NimbleListOptionModule { }
