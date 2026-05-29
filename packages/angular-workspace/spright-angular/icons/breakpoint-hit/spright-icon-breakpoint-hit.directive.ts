import { Directive } from '@angular/core';
import { type IconBreakpointHit, iconBreakpointHitTag } from '@ni/spright-components/dist/esm/icons/breakpoint-hit';
import '@ni/spright-components/dist/esm/icons/breakpoint-hit';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconBreakpointHit, iconBreakpointHitTag };

/**
 * Spright breakpoint hit icon directive
 */
@Directive({
    selector: 'spright-icon-breakpoint-hit',
    standalone: true
})
export class SprightIconBreakpointHitDirective extends SprightIconBaseDirective {
}