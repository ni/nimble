import { DesignSystem } from '@microsoft/fast-foundation';
import { accessControlKey16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { AccessControlIcon };

/**
 * The icon component for the 'access-control' icon
 */
class AccessControlIcon extends Icon {
    public constructor() {
        super(accessControlKey16X16);
    }
}

/**
 * A function that returns a nimble-access-control-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-access-control-icon\>
 *
 */
const nimbleAccessControlIcon = AccessControlIcon.compose({
    baseName: 'access-control-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAccessControlIcon());
