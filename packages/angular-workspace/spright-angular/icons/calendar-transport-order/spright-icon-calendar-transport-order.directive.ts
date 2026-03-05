import { Directive } from '@angular/core';
import { type IconCalendarTransportOrder, iconCalendarTransportOrderTag } from '@ni/spright-components/dist/esm/icons/calendar-transport-order';
import { SprightIconBaseDirective } from '../icon-base/spright-icon-base.directive';

export type { IconCalendarTransportOrder };
export { iconCalendarTransportOrderTag };

/**
 * Directive to provide Angular integration for the calendar transport order icon element.
 */
@Directive({
    selector: 'spright-icon-calendar-transport-order',
    standalone: false
})
export class SprightIconCalendarTransportOrderDirective extends SprightIconBaseDirective {
}
