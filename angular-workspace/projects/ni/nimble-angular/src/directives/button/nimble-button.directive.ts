import { Directive, Input } from '@angular/core';
import { type Button, buttonTag } from '@ni/nimble-components/dist/esm/button';
import type { ButtonType, ButtonAppearanceVariant } from '@ni/nimble-components/dist/esm/button/types';
import { NimbleButtonBaseDirective } from '../button-base/nimble-button-base.directive';

export type { Button };
export { buttonTag };
export { ButtonType };

/**
 * Directive to provide Angular integration for the button.
 */
@Directive({
    selector: 'nimble-button'
})
export class NimbleButtonDirective extends NimbleButtonBaseDirective<Button> {
    public get appearanceVariant(): ButtonAppearanceVariant {
        return this.elementRef.nativeElement.appearanceVariant;
    }

    // Renaming because property should have camel casing, but attribute should not
    // eslint-disable-next-line @angular-eslint/no-input-rename
    @Input('appearance-variant') public set appearanceVariant(value: ButtonAppearanceVariant) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'appearanceVariant', value);
    }

    public get type(): ButtonType {
        return this.elementRef.nativeElement.type;
    }

    @Input() public set type(value: ButtonType) {
        this.renderer.setProperty(this.elementRef.nativeElement, 'type', value);
    }
}
