import { arrowLeftFromLine16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-logout-icon': LogoutIcon;
    }
}

/**
 * The icon component for the 'logout' icon
 */
export class LogoutIcon extends Icon {
    public constructor() {
        super(arrowLeftFromLine16X16);
    }
}

registerIcon('logout-icon', LogoutIcon);
