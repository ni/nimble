import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMappingIconDirective } from './nimble-mapping-icon.directive';

import '@ni/nimble-components/dist/esm/mapping/icon';

@NgModule({
    declarations: [NimbleMappingIconDirective],
    imports: [CommonModule],
    exports: [NimbleMappingIconDirective]
})
export class NimbleMappingIconModule { }