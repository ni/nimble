import { customApplications16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

export type { CustomApplicationsIcon };
export const baseName = 'custom-applications-icon';

/**
 * The icon component for the 'custom-applications' icon
 */
class CustomApplicationsIcon extends Icon {
    public constructor() {
        super(customApplications16X16);
    }
}

registerIcon(baseName, CustomApplicationsIcon);
