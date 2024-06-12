import type { MenuButtonToggleEventDetail } from '../../menu-button/types';

/** @internal */
export const cellViewMenuSlotName = 'menu-button-menu' as const;

/**
 * The type of the detail associated with the `menu-button-column-beforetoggle` and `menu-button-column-toggle`
 * events on the menu button column.
 */
export interface MenuButtonColumnToggleEventDetail extends MenuButtonToggleEventDetail {
    recordId: string;
}
