import { managedSystems16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

/**
 * The icon component for the 'managed-systems' icon
 */
export class ManagedSystemsIcon extends Icon {
    public constructor() {
        super(managedSystems16X16);
    }
}

registerIcon('managed-systems-icon', ManagedSystemsIcon);
