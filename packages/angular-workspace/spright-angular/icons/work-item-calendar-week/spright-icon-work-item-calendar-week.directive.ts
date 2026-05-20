import { Directive } from '@angular/core';
import { type IconWorkItemCalendarWeek, iconWorkItemCalendarWeekTag } from '@ni/spright-components/dist/esm/icons/work-item-calendar-week';
import '@ni/spright-components/dist/esm/icons/work-item-calendar-week';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconWorkItemCalendarWeek, iconWorkItemCalendarWeekTag };

/**
 * Spright calendar week icon directive for reservation work items
 */
@Directive({
    selector: 'spright-icon-work-item-calendar-week',
    standalone: true
})
export class SprightIconWorkItemCalendarWeekDirective extends SprightIconBaseDirective {
}
