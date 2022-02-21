import { key16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-access-control-icon': AccessControlIcon;
    }
}

/**
 * The icon component for the 'access-control' icon
 */
export class AccessControlIcon extends Icon {
    public constructor() {
        super(key16X16);
    }
}

registerIcon('access-control-icon', AccessControlIcon);
