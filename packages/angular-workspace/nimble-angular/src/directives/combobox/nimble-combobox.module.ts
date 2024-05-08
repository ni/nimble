import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleComboboxDirective } from './nimble-combobox.directive';
import { NimbleComboboxControlValueAccessorDirective } from './nimble-combobox-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/combobox';

@NgModule({
    declarations: [NimbleComboboxDirective, NimbleComboboxControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleComboboxDirective, NimbleComboboxControlValueAccessorDirective]
})
export class NimbleComboboxModule { }
