import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SprightIconCalendarCalibrationDirective } from './spright-icon-calendar-calibration.directive';

import '@ni/spright-components/dist/esm/icons/calendar-calibration';

@NgModule({
    declarations: [SprightIconCalendarCalibrationDirective],
    imports: [CommonModule],
    exports: [SprightIconCalendarCalibrationDirective]
})
export class SprightIconCalendarCalibrationModule { }
