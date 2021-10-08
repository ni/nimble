import { DesignSystem } from '@microsoft/fast-foundation';
import { controlsCheckboxCheck16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { CheckIcon };

/**
 *  The icon component for the 'check' icon
 */
class CheckIcon extends Icon {
    public constructor() {
        super(controlsCheckboxCheck16X16);
    }
}

/**
 * A function that returns a nimble-check-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-check-icon\>
 *
 */
const nimbleCheckIcon = CheckIcon.compose({
    baseName: 'check-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCheckIcon());
