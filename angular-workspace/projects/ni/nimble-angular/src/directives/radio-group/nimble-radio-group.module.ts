import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NimbleRadioGroupDirective } from './nimble-radio-group.directive';

import '@ni/nimble-components/dist/esm/radio-group';

@NgModule({
    declarations: [NimbleRadioGroupDirective],
    imports: [CommonModule],
    exports: [NimbleRadioGroupDirective]
})
export class NimbleRadioGroupModule {}
