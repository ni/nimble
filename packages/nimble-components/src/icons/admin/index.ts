import { DesignSystem } from '@microsoft/fast-foundation';
import { admin16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { AdminIcon };

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
    baseName: 'admin-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAdminIcon());
