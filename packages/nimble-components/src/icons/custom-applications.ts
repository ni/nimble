import { DesignSystem } from '@microsoft/fast-foundation';
import { customApplications16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

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

/**
 * A function that returns a nimble-custom-applications-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-custom-applications-icon\>
 *
 */
const nimbleCustomApplicationsIcon = CustomApplicationsIcon.compose({
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleCustomApplicationsIcon());
