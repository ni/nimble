import { accessControlKey16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

/**
 * The icon component for the 'access-control' icon
 */
export class AccessControlIcon extends Icon {
    public constructor() {
        super(accessControlKey16X16);
    }
}

registerIcon('access-control-icon', AccessControlIcon);
