import { trash16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-delete-icon': DeleteIcon;
    }
}

/**
 * The icon component for the 'delete' icon
 */
export class DeleteIcon extends Icon {
    public constructor() {
        super(trash16X16);
    }
}

registerIcon('delete-icon', DeleteIcon);
