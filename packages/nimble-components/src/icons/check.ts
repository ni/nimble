import { check16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-check-icon': CheckIcon;
    }
}

/**
 *  The icon component for the 'check' icon
 */
export class CheckIcon extends Icon {
    public constructor() {
        super(check16X16);
    }
}

registerIcon('check-icon', CheckIcon);
