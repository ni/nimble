import { Directive } from '@angular/core';
import { type IconCalendarMaintenance, iconCalendarMaintenanceTag } from '@ni/spright-components/dist/esm/icons/calendar-maintenance';
import { SprightIconBaseDirective } from '../icon-base/spright-icon-base.directive';

export type { IconCalendarMaintenance };
export { iconCalendarMaintenanceTag };

/**
 * Directive to provide Angular integration for the calendar maintenance icon element.
 */
@Directive({
    selector: 'spright-icon-calendar-maintenance',
    standalone: false
})
export class SprightIconCalendarMaintenanceDirective extends SprightIconBaseDirective {
}
