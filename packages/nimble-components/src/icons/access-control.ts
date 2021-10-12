import { DesignSystem } from '@microsoft/fast-foundation';
import { accessControlKey16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { AccessControlIcon };
export const baseName = 'access-control-icon';

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
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAccessControlIcon());
