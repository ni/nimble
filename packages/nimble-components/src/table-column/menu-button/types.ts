import type { MenuButtonToggleEventDetail } from '../../menu-button/types';

export const menuSlotName = 'menu' as const;

/**
 * The type of the detail associated with the `menu-button-toggle` and `menu-button-beforetoggle`
 * events on the menu button column.
 */
export interface MenuButtonColumnToggleEventDetail {
    recordId: string;
    newState: boolean;
    oldState: boolean;
    originalEvent: CustomEvent<MenuButtonToggleEventDetail>;
}