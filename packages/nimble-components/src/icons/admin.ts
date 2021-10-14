import { admin16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

/**
 * The icon component for the 'admin' icon
 */
export class AdminIcon extends Icon {
    public constructor() {
        super(admin16X16);
    }
}

registerIcon('admin-icon', AdminIcon);
