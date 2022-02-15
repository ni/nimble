import { controlsArrowExpanderLeft16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-arrow-expander-left-icon': ArrowExpanderLeftIcon;
    }
}

/**
 * The icon component for the 'arrow-expander-right' icon
 */
export class ArrowExpanderLeftIcon extends Icon {
    public constructor() {
        super(controlsArrowExpanderLeft16X16);
    }
}

registerIcon('arrow-expander-left-icon', ArrowExpanderLeftIcon);
