import { Directive } from '@angular/core';
import { type IconBreakpointDisabled, iconBreakpointDisabledTag } from '@ni/spright-components/dist/esm/icons/breakpoint-disabled';
import '@ni/spright-components/dist/esm/icons/breakpoint-disabled';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconBreakpointDisabled, iconBreakpointDisabledTag };

/**
 * Spright breakpoint disabled icon directive
 */
@Directive({
    selector: 'spright-icon-breakpoint-disabled',
    standalone: true
})
export class SprightIconBreakpointDisabledDirective extends SprightIconBaseDirective {
}