import { Component, Input } from '@angular/core';
import { ButtonAppearance } from '@ni/nimble-components/dist/esm/button/types';

/**
 * This component provides a simple wrapper for the nimble button component. See:
 * https://github.com/ni/nimble/blob/main/packages/nimble-components/src/button/index.ts
 */
@Component({
    selector: 'nimble-angular-button',
    templateUrl: './nimble-button.component.html'
})
export class NimbleButtonComponent {
    /** Represents the disabled state of the component. */
    @Input() public disabled = false;

    /**  Helps control the appearance of the button with respect to its theme. See the following link
    *    for the set of valid states:
    *    https://github.com/ni/nimble/blob/main/packages/nimble-components/src/button/types.ts */
    @Input() public appearance = ButtonAppearance.Outline;
}