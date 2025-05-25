import { Menu } from '@ni/nimble-components/dist/esm/menu';
import { wrap } from '../utilities/react-wrapper';
import type { MenuItemChangeEvent } from '../menu-item';

export const NimbleMenu = wrap(Menu, {
    events: {
        onChange: 'change',
    }
});

/**
 * Bubbling event emitted by a menu item child when selected.
 * Easier to listen for the event on parent menu than on each menu item child.
 */
export type MenuChangeEvent = MenuItemChangeEvent;
