import { Directive } from '@angular/core';
import { type IconCalendarTestPlan, iconCalendarTestPlanTag } from '@ni/spright-components/dist/esm/icons/calendar-test-plan';
import { SprightIconBaseDirective } from '../icon-base/spright-icon-base.directive';

export type { IconCalendarTestPlan };
export { iconCalendarTestPlanTag };

/**
 * Directive to provide Angular integration for the calendar test plan icon element.
 */
@Directive({
    selector: 'spright-icon-calendar-test-plan',
    standalone: false
})
export class SprightIconCalendarTestPlanDirective extends SprightIconBaseDirective {
}
