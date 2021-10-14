import { administration16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

/**
 * The icon component for the 'administration' icon
 */
export class AdministrationIcon extends Icon {
    public constructor() {
        super(administration16X16);
    }
}

registerIcon('administration-icon', AdministrationIcon);
