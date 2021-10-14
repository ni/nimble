import { administration16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

export type { AdministrationIcon };
export const baseName = 'administration-icon';

/**
 * The icon component for the 'administration' icon
 */
class AdministrationIcon extends Icon {
    public constructor() {
        super(administration16X16);
    }
}

registerIcon(baseName, AdministrationIcon);
