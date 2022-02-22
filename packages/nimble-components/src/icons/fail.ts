import { xmark16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-fail-icon': FailIcon;
    }
}

/**
 *  The icon component for the 'fail' icon
 */
export class FailIcon extends Icon {
    public constructor() {
        super(xmark16X16);
    }
}

registerIcon('fail-icon', FailIcon);
