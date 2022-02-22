import { circleX16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-terminated-icon': TerminatedIcon;
    }
}

/**
 *  The icon component for the 'terminated' icon
 */
export class TerminatedIcon extends Icon {
    public constructor() {
        super(circleX16X16);
    }
}

registerIcon('terminated-icon', TerminatedIcon);
