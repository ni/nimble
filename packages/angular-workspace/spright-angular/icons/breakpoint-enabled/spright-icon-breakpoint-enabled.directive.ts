import { Directive } from '@angular/core';
import { type IconBreakpointEnabled, iconBreakpointEnabledTag } from '@ni/spright-components/dist/esm/icons/breakpoint-enabled';
import '@ni/spright-components/dist/esm/icons/breakpoint-enabled';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconBreakpointEnabled, iconBreakpointEnabledTag };

/**
 * Spright breakpoint enabled icon directive
 */
@Directive({
    selector: 'spright-icon-breakpoint-enabled',
    standalone: true
})
export class SprightIconBreakpointEnabledDirective extends SprightIconBaseDirective {
}