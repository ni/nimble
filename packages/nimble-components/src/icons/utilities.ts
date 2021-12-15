import { boxUtilities16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-utilities-icon': UtilitiesIcon;
    }
}

/**
 * The icon component for the 'utilities' icon
 */
export class UtilitiesIcon extends Icon {
    public constructor() {
        super(boxUtilities16X16);
    }
}

registerIcon('utilities-icon', UtilitiesIcon);
