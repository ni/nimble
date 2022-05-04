import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleComboboxDirective } from './nimble-combobox.directive';

import '@ni/nimble-components/dist/esm/combobox';

@NgModule({
    declarations: [NimbleComboboxDirective],
    imports: [CommonModule],
    exports: [NimbleComboboxDirective]
})
export class NimbleComboboxModule { }
