import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { OkFvDateTimePickerDirective } from './ok-fv-date-time-picker.directive';
import { OkFvDateTimePickerValueAccessor } from './ok-fv-date-time-picker-value-accessor.directive';

import '@ni/ok-components/dist/esm/fv/date-time-picker';

@NgModule({
    declarations: [OkFvDateTimePickerDirective, OkFvDateTimePickerValueAccessor],
    imports: [CommonModule],
    exports: [OkFvDateTimePickerDirective, OkFvDateTimePickerValueAccessor]
})
export class OkFvDateTimePickerModule { }
