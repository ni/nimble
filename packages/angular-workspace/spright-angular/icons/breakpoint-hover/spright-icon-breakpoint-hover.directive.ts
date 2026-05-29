import { Directive } from '@angular/core';
import { type IconBreakpointHover, iconBreakpointHoverTag } from '@ni/spright-components/dist/esm/icons/breakpoint-hover';
import '@ni/spright-components/dist/esm/icons/breakpoint-hover';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconBreakpointHover, iconBreakpointHoverTag };

/**
 * Spright breakpoint hover icon directive
 */
@Directive({
    selector: 'spright-icon-breakpoint-hover',
    standalone: true
})
export class SprightIconBreakpointHoverDirective extends SprightIconBaseDirective {
}