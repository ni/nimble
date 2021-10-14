import { settings16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

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

registerIcon(baseName, SettingsIcon);
