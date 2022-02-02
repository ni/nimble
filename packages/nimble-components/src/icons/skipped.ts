import { statusSkipped16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-skipped-icon': SkippedIcon;
    }
}

/**
 *  The icon component for the 'skipped' icon
 */
export class SkippedIcon extends Icon {
    public constructor() {
        super(statusSkipped16X16);
    }
}

registerIcon('skipped-icon', SkippedIcon);
