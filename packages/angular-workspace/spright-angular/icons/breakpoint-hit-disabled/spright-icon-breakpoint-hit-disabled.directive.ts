import { Directive } from '@angular/core';
import { type IconBreakpointHitDisabled, iconBreakpointHitDisabledTag } from '@ni/spright-components/dist/esm/icons/breakpoint-hit-disabled';
import '@ni/spright-components/dist/esm/icons/breakpoint-hit-disabled';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconBreakpointHitDisabled, iconBreakpointHitDisabledTag };

/**
 * Spright breakpoint hit disabled icon directive
 */
@Directive({
    selector: 'spright-icon-breakpoint-hit-disabled',
    standalone: true
})
export class SprightIconBreakpointHitDisabledDirective extends SprightIconBaseDirective {
}