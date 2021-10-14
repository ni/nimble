import { controlsCheckboxCheck16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

/**
 *  The icon component for the 'check' icon
 */
export class CheckIcon extends Icon {
    public constructor() {
        super(controlsCheckboxCheck16X16);
    }
}

registerIcon('check-icon', CheckIcon);
