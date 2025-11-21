import { MenuButton } from '@ni/nimble-components/dist/esm/menu-button';
import { type MenuButtonToggleEventDetail } from '@ni/nimble-components/dist/esm/menu-button/types';
import { wrap, type EventName } from '../utilities/react-wrapper';
import type { MenuItemChangeEvent } from '../menu-item';

export { type MenuButton };
export const NimbleMenuButton = wrap(MenuButton, {
    events: {
        onChange: 'change' as EventName<MenuButtonChangeEvent>,
        onToggle: 'toggle' as EventName<MenuButtonToggleEvent>,
        onBeforeToggle: 'beforetoggle' as EventName<MenuButtonBeforeToggleEvent>,
    }
});
/**
 * Bubbling event emitted by a menu item child when selected.
 * Easier to listen for the event on parent menu button than on each menu item child.
 */
export type MenuButtonChangeEvent = MenuItemChangeEvent;
export interface MenuButtonToggleEvent extends CustomEvent<MenuButtonToggleEventDetail> {
    target: MenuButton;
}
export interface MenuButtonBeforeToggleEvent extends CustomEvent<MenuButtonToggleEventDetail> {
    target: MenuButton;
}
