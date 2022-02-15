import { controlsArrowExpanderUp16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-arrow-expander-up-icon': ArrowExpanderUpIcon;
    }
}

/**
 * The icon component for the 'arrow-expander-up' icon
 */
export class ArrowExpanderUpIcon extends Icon {
    public constructor() {
        super(controlsArrowExpanderUp16X16);
    }
}

registerIcon('arrow-expander-up-icon', ArrowExpanderUpIcon);
