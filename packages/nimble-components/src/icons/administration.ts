import { DesignSystem } from '@microsoft/fast-foundation';
import { administration16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { AdministrationIcon };
export const baseName = 'administration-icon';

/**
 * The icon component for the 'administration' icon
 */
class AdministrationIcon extends Icon {
    public constructor() {
        super(administration16X16);
    }
}

/**
 * A function that returns a nimble-administration-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-administration-icon\>
 *
 */
const nimbleAdministrationIcon = AdministrationIcon.compose({
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleAdministrationIcon());
