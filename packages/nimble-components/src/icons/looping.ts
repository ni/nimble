import { arrowsRepeat16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-looping-icon': LoopingIcon;
    }
}

/**
 *  The icon component for the 'looping' icon
 */
export class LoopingIcon extends Icon {
    public constructor() {
        super(arrowsRepeat16X16);
    }
}

registerIcon('looping-icon', LoopingIcon);
