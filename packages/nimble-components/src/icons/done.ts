import { checkDot16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-done-icon': DoneIcon;
    }
}

/**
 *  The icon component for the 'done' icon
 */
export class DoneIcon extends Icon {
    public constructor() {
        super(checkDot16X16);
    }
}

registerIcon('done-icon', DoneIcon);
