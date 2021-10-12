import { DesignSystem } from '@microsoft/fast-foundation';
import { logout16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { LogoutIcon };
export const baseName = 'logout-icon';

/**
 * The icon component for the 'logout' icon
 */
class LogoutIcon extends Icon {
    public constructor() {
        super(logout16X16);
    }
}

/**
 * A function that returns a nimble-logout-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-logout-icon\>
 *
 */
const nimbleLogoutIcon = LogoutIcon.compose({
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleLogoutIcon());
