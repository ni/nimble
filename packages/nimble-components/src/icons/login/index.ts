import { DesignSystem } from '@microsoft/fast-foundation';
import { login16X16 } from '@ni/nimble-tokens/dist-icons-esm/nimble-icons-inline';
import { Icon, template } from '..';
import { styles } from '../styles';

export type { LoginIcon };

/**
 * The icon component for the 'login' icon
 */
class LoginIcon extends Icon {
    public constructor() {
        super(login16X16);
    }
}

/**
 * A function that returns a nimble-login-icon registration for configuring the component with a DesignSystem.
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-login-icon\>
 *
 */
const nimbleLoginIcon = LoginIcon.compose({
    baseName: 'login-icon',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleLoginIcon());
