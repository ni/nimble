import { chartDiagramChildFocus16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-managed-systems-icon': ManagedSystemsIcon;
    }
}

/**
 * The icon component for the 'managed-systems' icon
 */
export class ManagedSystemsIcon extends Icon {
    public constructor() {
        super(chartDiagramChildFocus16X16);
    }
}

registerIcon('managed-systems-icon', ManagedSystemsIcon);
