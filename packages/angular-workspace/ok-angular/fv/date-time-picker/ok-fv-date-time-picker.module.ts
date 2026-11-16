import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvDateTimePickerDirective } from './ok-fv-date-time-picker.directive';

import '@ni/ok-components/dist/esm/fv/date-time-picker';

@NgModule({
    declarations: [OkFvDateTimePickerDirective],
    imports: [CommonModule],
    exports: [OkFvDateTimePickerDirective]
})
export class OkFvDateTimePickerModule { }
