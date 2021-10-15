import { DesignSystem } from '@microsoft/fast-foundation';
import { settings16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon } from '../icon-base';
import { template } from '../icon-base/template';
import { styles } from '../icon-base/styles';

export type { SettingsIcon };
export const baseName = 'settings-icon';

/**
 * The icon component for the 'settings' icon
 */
class SettingsIcon extends Icon {
    public constructor() {
        super(settings16X16);
    }
}

/**
 * A function that returns a nimble-settings-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-settings-icon\>
 *
 */
const nimbleSettingsIcon = SettingsIcon.compose({
    baseName,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleSettingsIcon());
