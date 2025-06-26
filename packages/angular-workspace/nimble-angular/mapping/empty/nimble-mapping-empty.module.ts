import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMappingEmptyDirective } from './nimble-mapping-empty.directive';

import '@ni/nimble-components/dist/esm/mapping/empty';

@NgModule({
    declarations: [NimbleMappingEmptyDirective],
    imports: [CommonModule],
    exports: [NimbleMappingEmptyDirective]
})
export class NimbleMappingEmptyModule { }