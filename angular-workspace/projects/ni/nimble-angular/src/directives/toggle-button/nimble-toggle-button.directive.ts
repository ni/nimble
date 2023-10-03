import { Directive, ElementRef, Input, Renderer2 } from '@angular/core';
import { type ToggleButton, toggleButtonTag } from '@ni/nimble-components/dist/esm/toggle-button';
import type { ButtonAppearance } from '@ni/nimble-components/dist/esm/toggle-button/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleButtonBaseDirective } from '../button-base/nimble-button-base.directive';

export type { ToggleButton };
export { toggleButtonTag };

/**
 * Directive to provide Angular integration for the toggle button.
 */
@Directive({
    selector: 'nimble-toggle-button'
})
export class NimbleToggleButtonDirective extends NimbleButtonBaseDirective<ToggleButton> {
    public get checked(): boolean {
        return this.elementRef.nativeElement.checked;
    }

    @Input() public set checked(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'checked', toBooleanProperty(value));
    }
}
