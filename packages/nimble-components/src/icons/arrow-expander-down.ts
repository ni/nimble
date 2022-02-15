import { controlsArrowExpanderDown16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-arrow-expander-down-icon': ArrowExpanderDownIcon;
    }
}

/**
 * The icon component for the 'arrow-expander-right' icon
 */
export class ArrowExpanderDownIcon extends Icon {
    public constructor() {
        super(controlsArrowExpanderDown16X16);
    }
}

registerIcon('arrow-expander-down-icon', ArrowExpanderDownIcon);
