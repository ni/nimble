import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleSpinnerDirective } from './nimble-spinner.directive';

import '@ni/nimble-components/dist/esm/spinner';

@NgModule({
    declarations: [NimbleSpinnerDirective],
    imports: [CommonModule],
    exports: [NimbleSpinnerDirective]
})
export class NimbleSpinnerModule { }
