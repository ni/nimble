import { DesignSystem } from '@microsoft/fast-foundation';
import { admin16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { AdminIcon };
export const baseName = 'admin-icon';

/**
 * The icon component for the 'admin' icon
 */
class AdminIcon extends Icon {
    public constructor() {
        super(admin16X16);
    }
}

/**
 * A function that returns a nimble-admin-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-admin-icon\>
 *
 */
const nimbleAdminIcon = AdminIcon.compose({
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAdminIcon());
