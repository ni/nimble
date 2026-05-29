import { Directive } from '@angular/core';
import { type IconWorkItemUserHelmetSafety, iconWorkItemUserHelmetSafetyTag } from '@ni/spright-components/dist/esm/icons/work-item-user-helmet-safety';
import '@ni/spright-components/dist/esm/icons/work-item-user-helmet-safety';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconWorkItemUserHelmetSafety, iconWorkItemUserHelmetSafetyTag };

/**
 * Spright user helmet safety icon directive for work items
 */
@Directive({
    selector: 'spright-icon-work-item-user-helmet-safety',
    standalone: true
})
export class SprightIconWorkItemUserHelmetSafetyDirective extends SprightIconBaseDirective {
}
