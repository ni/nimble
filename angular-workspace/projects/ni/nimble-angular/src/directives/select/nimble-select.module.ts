import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleSelectDirective } from './nimble-select.directive';
import { NimbleSelectControlValueAccessorDirective } from './nimble-select-control-value-accessor.directive';

import '@ni/nimble-components/dist/esm/select';

@NgModule({
    declarations: [NimbleSelectDirective, NimbleSelectControlValueAccessorDirective],
    imports: [CommonModule],
    exports: [NimbleSelectDirective, NimbleSelectControlValueAccessorDirective]
})
export class NimbleSelectModule { }
