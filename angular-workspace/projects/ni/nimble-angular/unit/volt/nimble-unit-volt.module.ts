import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleUnitVoltDirective } from './nimble-unit-volt.directive';

import '@ni/nimble-components/dist/esm/unit/volt';

@NgModule({
    declarations: [NimbleUnitVoltDirective],
    imports: [CommonModule],
    exports: [NimbleUnitVoltDirective]
})
export class NimbleUnitVoltModule { }