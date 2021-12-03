import { statusSucceeded16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

/**
 *  The icon component for the 'succeeded' icon
 */
export class SucceededIcon extends Icon {
    public constructor() {
        super(statusSucceeded16X16);
    }
}

registerIcon('succeeded-icon', SucceededIcon);
