import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleUnitFahrenheitDirective } from './nimble-unit-fahrenheit.directive';

import '@ni/nimble-components/dist/esm/unit/fahrenheit';

@NgModule({
    declarations: [NimbleUnitFahrenheitDirective],
    imports: [CommonModule],
    exports: [NimbleUnitFahrenheitDirective]
})
export class NimbleUnitFahrenheitModule { }