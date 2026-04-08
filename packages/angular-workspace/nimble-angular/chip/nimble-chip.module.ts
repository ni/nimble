import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleChipDirective } from './nimble-chip.directive';

import '@ni/nimble-components/dist/esm/chip';

@NgModule({
    declarations: [NimbleChipDirective],
    imports: [CommonModule],
    exports: [NimbleChipDirective]
})
export class NimbleChipModule { }
