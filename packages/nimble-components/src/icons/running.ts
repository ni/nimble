import { runningArrow16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-running-icon': RunningIcon;
    }
}

/**
 *  The icon component for the 'running' icon
 */
export class RunningIcon extends Icon {
    public constructor() {
        super(runningArrow16X16);
    }
}

registerIcon('running-icon', RunningIcon);
