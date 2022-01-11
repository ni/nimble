import { customApplications16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-custom-applications-icon': CustomApplicationsIcon;
    }
}

/**
 * The icon component for the 'custom-applications' icon
 */
export class CustomApplicationsIcon extends Icon {
    public constructor() {
        super(customApplications16X16);
    }
}

registerIcon('custom-applications-icon', CustomApplicationsIcon);
