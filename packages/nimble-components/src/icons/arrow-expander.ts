import { controlsArrowExpanderRight16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-arrow-expander-right-icon': ArrowExpanderRightIcon;
    }
}

/**
 * The icon component for the 'expand' icon
 */
export class ArrowExpanderRightIcon extends Icon {
    public constructor() {
        super(controlsArrowExpanderRight16X16);
    }
}

registerIcon('arrow-expander-right-icon', ArrowExpanderRightIcon);
