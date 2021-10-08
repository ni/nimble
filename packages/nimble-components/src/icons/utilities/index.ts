import { DesignSystem } from '@microsoft/fast-foundation';
import { boxUtilities16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { UtilitiesIcon };

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
    baseName: 'utilities-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleUtilitiesIcon());
