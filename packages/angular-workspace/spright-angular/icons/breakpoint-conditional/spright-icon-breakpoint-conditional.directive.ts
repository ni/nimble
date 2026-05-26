import { Directive } from '@angular/core';
import { type IconBreakpointConditional, iconBreakpointConditionalTag } from '@ni/spright-components/dist/esm/icons/breakpoint-conditional';
import '@ni/spright-components/dist/esm/icons/breakpoint-conditional';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconBreakpointConditional, iconBreakpointConditionalTag };

/**
 * Spright breakpoint conditional icon directive
 */
@Directive({
    selector: 'spright-icon-breakpoint-conditional',
    standalone: true
})
export class SprightIconBreakpointConditionalDirective extends SprightIconBaseDirective {
}