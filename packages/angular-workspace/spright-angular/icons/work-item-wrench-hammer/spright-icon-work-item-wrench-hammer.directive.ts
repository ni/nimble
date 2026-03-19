import { Directive } from '@angular/core';
import { type IconWorkItemWrenchHammer, iconWorkItemWrenchHammerTag } from '@ni/spright-components/dist/esm/icons/work-item-wrench-hammer';
import '@ni/spright-components/dist/esm/icons/work-item-wrench-hammer';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconWorkItemWrenchHammer, iconWorkItemWrenchHammerTag };

/**
 * Spright wrench hammer icon directive for maintenance work items
 */
@Directive({
    selector: 'spright-icon-work-item-wrench-hammer',
    standalone: true
})
export class SprightIconWorkItemWrenchHammerDirective extends SprightIconBaseDirective {
}
