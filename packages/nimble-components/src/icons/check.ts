import { DesignSystem } from '@microsoft/fast-foundation';
import { controlsCheckboxCheck16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { CheckIcon };
export const baseName = 'check-icon';

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
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleCheckIcon());
