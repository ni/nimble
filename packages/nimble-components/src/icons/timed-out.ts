import { clockTriangle16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-timed-out-icon': TimedOutIcon;
    }
}

/**
 *  The icon component for the 'timed-out' icon
 */
export class TimedOutIcon extends Icon {
    public constructor() {
        super(clockTriangle16X16);
    }
}

registerIcon('timed-out-icon', TimedOutIcon);
