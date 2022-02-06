import { statusCustom16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-custom-status-icon': CustomStatusIcon;
    }
}

/**
 *  The icon component for the 'custom-status' icon
 */
export class CustomStatusIcon extends Icon {
    public constructor() {
        super(statusCustom16X16);
    }
}

registerIcon('custom-status-icon', CustomStatusIcon);
