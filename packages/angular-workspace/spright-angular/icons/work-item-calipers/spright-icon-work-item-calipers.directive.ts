import { Directive } from '@angular/core';
import { type IconWorkItemCalipers, iconWorkItemCalipersTag } from '@ni/spright-components/dist/esm/icons/work-item-calipers';
import '@ni/spright-components/dist/esm/icons/work-item-calipers';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconWorkItemCalipers, iconWorkItemCalipersTag };

/**
 * Spright calipers icon directive for calibration work items
 */
@Directive({
    selector: 'spright-icon-work-item-calipers',
    standalone: true
})
export class SprightIconWorkItemCalipersDirective extends SprightIconBaseDirective {
}
