import { admin16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

export type { AdminIcon };
export const baseName = 'admin-icon';

/**
 * The icon component for the 'admin' icon
 */
class AdminIcon extends Icon {
    public constructor() {
        super(admin16X16);
    }
}

registerIcon(baseName, AdminIcon);
