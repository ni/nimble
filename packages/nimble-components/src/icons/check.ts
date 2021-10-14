import { controlsCheckboxCheck16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

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

registerIcon(baseName, CheckIcon);
