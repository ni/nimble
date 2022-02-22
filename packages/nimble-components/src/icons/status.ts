import { dotSolidDotStroke16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-status-icon': StatusIcon;
    }
}

/**
 *  The icon component for the 'status' icon
 */
export class StatusIcon extends Icon {
    public constructor() {
        super(dotSolidDotStroke16X16);
    }
}

registerIcon('status-icon', StatusIcon);
