import { cogDatabase16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-administration-icon': AdministrationIcon;
    }
}

/**
 * The icon component for the 'administration' icon
 */
export class AdministrationIcon extends Icon {
    public constructor() {
        super(cogDatabase16X16);
    }
}

registerIcon('administration-icon', AdministrationIcon);
