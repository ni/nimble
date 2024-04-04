import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NimbleDatePickerDirective } from './nimble-date-picker.directive';

import '@ni/nimble-components/dist/esm/date-picker';

@NgModule({
    declarations: [NimbleDatePickerDirective],
    imports: [CommonModule],
    exports: [NimbleDatePickerDirective]
})
export class NimbleDatePickerModule { }
