import { DesignSystem } from '@microsoft/fast-foundation';
import { MenuButton as NimbleMenuButtonBase } from '@ni/nimble-foundation/dist/esm/menu-button';
import { template } from '@ni/nimble-foundation/dist/esm/menu-button/template';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-menu-button': MenuButton;
    }
}

/**
 * A nimble-styled menu button control.
 */
export class MenuButton extends NimbleMenuButtonBase { }

const nimbleMenuButton = MenuButton.compose({
    baseName: 'menu-button',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleMenuButton());
export const menuButtonTag = DesignSystem.tagFor(MenuButton);
