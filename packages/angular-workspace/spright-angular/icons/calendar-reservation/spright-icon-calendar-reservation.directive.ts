import { Directive } from '@angular/core';
import { type IconCalendarReservation, iconCalendarReservationTag } from '@ni/spright-components/dist/esm/icons/calendar-reservation';
import { SprightIconBaseDirective } from '../icon-base/spright-icon-base.directive';

export type { IconCalendarReservation };
export { iconCalendarReservationTag };

/**
 * Directive to provide Angular integration for the calendar reservation icon element.
 */
@Directive({
    selector: 'spright-icon-calendar-reservation',
    standalone: false
})
export class SprightIconCalendarReservationDirective extends SprightIconBaseDirective {
}
