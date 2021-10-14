import { boxUtilities16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

export type { UtilitiesIcon };
export const baseName = 'utilities-icon';

/**
 * The icon component for the 'utilities' icon
 */
class UtilitiesIcon extends Icon {
    public constructor() {
        super(boxUtilities16X16);
    }
}

registerIcon(baseName, UtilitiesIcon);
