import { DesignSystem } from '@microsoft/fast-foundation';
import { logout16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { LogoutIcon };

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
    baseName: 'logout-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleLogoutIcon());
