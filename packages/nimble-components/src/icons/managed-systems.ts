import { DesignSystem } from '@microsoft/fast-foundation';
import { managedSystems16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { ManagedSystemsIcon };
export const baseName = 'managed-systems-icon';

/**
 * The icon component for the 'managed-systems' icon
 */
class ManagedSystemsIcon extends Icon {
    public constructor() {
        super(managedSystems16X16);
    }
}

/**
 * A function that returns a nimble-managed-systems-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-managed-systems-icon\>
 *
 */
const nimbleManagedSystemsIcon = ManagedSystemsIcon.compose({
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleManagedSystemsIcon());
