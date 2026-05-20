import { Directive } from '@angular/core';
import { type IconWorkItemForklift, iconWorkItemForkliftTag } from '@ni/spright-components/dist/esm/icons/work-item-forklift';
import '@ni/spright-components/dist/esm/icons/work-item-forklift';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconWorkItemForklift, iconWorkItemForkliftTag };

/**
 * Spright forklift icon directive for transport work items
 */
@Directive({
    selector: 'spright-icon-work-item-forklift',
    standalone: true
})
export class SprightIconWorkItemForkliftDirective extends SprightIconBaseDirective {
}
