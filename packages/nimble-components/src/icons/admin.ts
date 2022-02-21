import { user16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-admin-icon': AdminIcon;
    }
}

/**
 * The icon component for the 'admin' icon
 */
export class AdminIcon extends Icon {
    public constructor() {
        super(user16X16);
    }
}

registerIcon('admin-icon', AdminIcon);
