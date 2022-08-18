import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import type { ListOption } from '@ni/nimble-components/dist/esm/list-option';
import { NimbleSelectListOptionDirective } from './nimble-select-list-option.directive';
import { NimbleComboboxListOptionDirective } from './nimble-combobox-list-option.directive';

export type { ListOption };

@NgModule({
    declarations: [NimbleSelectListOptionDirective, NimbleComboboxListOptionDirective],
    imports: [CommonModule],
    exports: [NimbleSelectListOptionDirective, NimbleComboboxListOptionDirective]
})
export class NimbleListOptionModule { }
