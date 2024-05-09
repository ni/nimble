import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleUnitCelsiusDirective } from './nimble-unit-celsius.directive';

import '@ni/nimble-components/dist/esm/unit/celsius';

@NgModule({
    declarations: [NimbleUnitCelsiusDirective],
    imports: [CommonModule],
    exports: [NimbleUnitCelsiusDirective]
})
export class NimbleUnitCelsiusModule { }