import { logout16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

export type { LogoutIcon };
export const baseName = 'logout-icon';

/**
 * The icon component for the 'logout' icon
 */
class LogoutIcon extends Icon {
    public constructor() {
        super(logout16X16);
    }
}

registerIcon(baseName, LogoutIcon);
