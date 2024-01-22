import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleUnitByteDirective } from './nimble-unit-byte.directive';

import '@ni/nimble-components/dist/esm/unit/byte';

@NgModule({
    declarations: [NimbleUnitByteDirective],
    imports: [CommonModule],
    exports: [NimbleUnitByteDirective]
})
export class NimbleUnitByteModule { }