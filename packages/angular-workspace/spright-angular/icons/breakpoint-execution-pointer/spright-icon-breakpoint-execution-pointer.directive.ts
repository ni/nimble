import { Directive } from '@angular/core';
import { type IconBreakpointExecutionPointer, iconBreakpointExecutionPointerTag } from '@ni/spright-components/dist/esm/icons/breakpoint-execution-pointer';
import '@ni/spright-components/dist/esm/icons/breakpoint-execution-pointer';
import { SprightIconBaseDirective } from '@ni/spright-angular/icon-base';

export { type IconBreakpointExecutionPointer, iconBreakpointExecutionPointerTag };

/**
 * Spright breakpoint execution pointer icon directive
 */
@Directive({
    selector: 'spright-icon-breakpoint-execution-pointer',
    standalone: true
})
export class SprightIconBreakpointExecutionPointerDirective extends SprightIconBaseDirective {
}