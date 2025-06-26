import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleMappingSpinnerDirective } from './nimble-mapping-spinner.directive';

import '@ni/nimble-components/dist/esm/mapping/spinner';

@NgModule({
    declarations: [NimbleMappingSpinnerDirective],
    imports: [CommonModule],
    exports: [NimbleMappingSpinnerDirective]
})
export class NimbleMappingSpinnerModule { }