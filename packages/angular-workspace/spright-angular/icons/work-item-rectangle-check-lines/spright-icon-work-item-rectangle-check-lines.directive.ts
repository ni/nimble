import { Directive } from '@angular/core';
import { type IconWorkItemRectangleCheckLines, iconWorkItemRectangleCheckLinesTag } from '@ni/spright-components/dist/esm/icons/work-item-rectangle-check-lines';
import '@ni/spright-components/dist/esm/icons/work-item-rectangle-check-lines';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconWorkItemRectangleCheckLines, iconWorkItemRectangleCheckLinesTag };

/**
 * Spright rectangle check lines icon directive for test plan work items
 */
@Directive({
    selector: 'spright-icon-work-item-rectangle-check-lines',
    standalone: true
})
export class SprightIconWorkItemRectangleCheckLinesDirective extends SprightIconBaseDirective {
}
