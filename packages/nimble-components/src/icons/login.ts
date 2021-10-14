import { login16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, registerIcon } from '../icon-base';

export type { LoginIcon };
export const baseName = 'login-icon';

/**
 * The icon component for the 'login' icon
 */
class LoginIcon extends Icon {
    public constructor() {
        super(login16X16);
    }
}

registerIcon(baseName, LoginIcon);
