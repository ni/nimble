import { Directive, Input } from '@angular/core';
import { type MenuButton, menuButtonTag } from '@ni/nimble-components/dist/esm/menu-button';
import type { MenuButtonToggleEventDetail } from '@ni/nimble-components/dist/esm/menu-button/types';
import { BooleanValueOrAttribute, toBooleanProperty } from '@ni/nimble-angular/internal-utilities';
import { NimbleButtonBaseDirective } from '../button-base/nimble-button-base.directive';

export type { MenuButton };
export { menuButtonTag };
export type { MenuButtonToggleEventDetail };

/**
 * Directive to provide Angular integration for the menu button.
 */
@Directive({
    selector: 'nimble-menu-button'
})
export class NimbleMenuButtonDirective extends NimbleButtonBaseDirective<MenuButton> {
    public get open(): boolean {
        return this.elementRef.nativeElement.open;
    }

    @Input() public set open(value: BooleanValueOrAttribute) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'open', toBooleanProperty(value));
    }
}
