import { DesignSystem } from '@microsoft/fast-foundation';
import { managedSystems16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { ManagedSystemsIcon };

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
    baseName: 'managed-systems-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleManagedSystemsIcon());
