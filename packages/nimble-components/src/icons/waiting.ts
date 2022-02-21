import { watch16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-waiting-icon': WaitingIcon;
    }
}

/**
 *  The icon component for the 'waiting' icon
 */
export class WaitingIcon extends Icon {
    public constructor() {
        super(watch16X16);
    }
}

registerIcon('waiting-icon', WaitingIcon);
