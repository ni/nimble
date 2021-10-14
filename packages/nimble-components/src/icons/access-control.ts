import { accessControlKey16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

export type { AccessControlIcon };
export const baseName = 'access-control-icon';

/**
 * The icon component for the 'access-control' icon
 */
class AccessControlIcon extends Icon {
    public constructor() {
        super(accessControlKey16X16);
    }
}

registerIcon(baseName, AccessControlIcon);
