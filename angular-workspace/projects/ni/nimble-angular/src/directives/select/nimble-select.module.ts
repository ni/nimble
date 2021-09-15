import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleSelectDirective } from './nimble-select.directive';
import { NimbleSelectControlValueAccessor, NimbleSelectOption } from './nimble-select-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/select';

@NgModule({
    declarations: [NimbleSelectDirective, NimbleSelectControlValueAccessor, NimbleSelectOption],
    imports: [CommonModule],
    exports: [NimbleSelectDirective, NimbleSelectControlValueAccessor, NimbleSelectOption]
})
export class NimbleSelectModule { }
