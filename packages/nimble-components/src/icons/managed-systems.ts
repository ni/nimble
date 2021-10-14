import { managedSystems16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

export type { ManagedSystemsIcon };
export const baseName = 'managed-systems-icon';

/**
 * The icon component for the 'managed-systems' icon
 */
class ManagedSystemsIcon extends Icon {
    public constructor() {
        super(managedSystems16X16);
    }
}

registerIcon(baseName, ManagedSystemsIcon);
