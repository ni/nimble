import { DesignSystem } from '@microsoft/fast-foundation';
import { boxUtilities16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { UtilitiesIcon };
export const baseName = 'utilities-icon';

/**
 * The icon component for the 'utilities' icon
 */
class UtilitiesIcon extends Icon {
    public constructor() {
        super(boxUtilities16X16);
    }
}

/**
 * A function that returns a nimble-utilities-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-utilities-icon\>
 *
 */
const nimbleUtilitiesIcon = UtilitiesIcon.compose({
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUtilitiesIcon());
