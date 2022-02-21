import { check16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-succeeded-icon': SucceededIcon;
    }
}

/**
 *  The icon component for the 'succeeded' icon
 */
export class SucceededIcon extends Icon {
    public constructor() {
        super(check16X16);
    }
}

registerIcon('succeeded-icon', SucceededIcon);
