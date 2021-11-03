import { login16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

/**
 * The icon component for the 'login' icon
 */
export class LoginIcon extends Icon {
    public constructor() {
        super(login16X16);
    }
}

registerIcon('login-icon', LoginIcon);
