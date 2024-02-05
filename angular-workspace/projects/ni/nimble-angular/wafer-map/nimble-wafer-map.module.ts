import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleWaferMapDirective } from './nimble-wafer-map.directive';

import '@ni/nimble-components/dist/esm/unit/volt';

@NgModule({
    declarations: [NimbleWaferMapDirective],
    imports: [CommonModule],
    exports: [NimbleWaferMapDirective]
})
export class NimbleWaferMapModule { }