import { Directive } from '@angular/core';
import { type IconWorkItemSquareListCog, iconWorkItemSquareListCogTag } from '@ni/spright-components/dist/esm/icons/work-item-square-list-cog';
import '@ni/spright-components/dist/esm/icons/work-item-square-list-cog';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconWorkItemSquareListCog, iconWorkItemSquareListCogTag };

/**
 * Spright square list cog icon directive for work order items
 */
@Directive({
    selector: 'spright-icon-work-item-square-list-cog',
    standalone: true
})
export class SprightIconWorkItemSquareListCogDirective extends SprightIconBaseDirective {
}
