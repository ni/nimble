import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleListOptionDirective } from './nimble-list-option.directive';
import { NimbleSelectListOptionDirective } from './nimble-select-list-option.directive';
import { NimbleComboboxListOptionDirective } from './nimble-combobox-list-option.directive';

import '@ni/nimble-components/dist/esm/list-option';

@NgModule({
    declarations: [
        NimbleListOptionDirective,
        NimbleSelectListOptionDirective,
        NimbleComboboxListOptionDirective
    ],
    imports: [CommonModule],
    exports: [
        NimbleListOptionDirective,
        NimbleSelectListOptionDirective,
        NimbleComboboxListOptionDirective
    ]
})
export class NimbleListOptionModule { }
