import { Directive } from '@angular/core';
import { type IconCalendarCalibration, iconCalendarCalibrationTag } from '@ni/spright-components/dist/esm/icons/calendar-calibration';
import { SprightIconBaseDirective } from '../icon-base/spright-icon-base.directive';

export type { IconCalendarCalibration };
export { iconCalendarCalibrationTag };

/**
 * Directive to provide Angular integration for the calendar calibration icon element.
 */
@Directive({
    selector: 'spright-icon-calendar-calibration',
    standalone: false
})
export class SprightIconCalendarCalibrationDirective extends SprightIconBaseDirective {
}
