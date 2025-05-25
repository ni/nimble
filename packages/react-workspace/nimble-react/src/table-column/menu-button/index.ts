import { TableColumnMenuButton } from '@ni/nimble-components/dist/esm/table-column/menu-button';
import { type MenuButtonColumnToggleEventDetail } from '@ni/nimble-components/dist/esm/table-column/menu-button/types';
import { wrap } from '../../utilities/react-wrapper';

export const NimbleTableColumnMenuButton = wrap(TableColumnMenuButton, {
    events: {
        onToggle: 'menu-button-column-toggle',
        onBeforeToggle: 'menu-button-column-beforetoggle',
    }
});

export interface TableColumnMenuButtonToggleEvent extends CustomEvent<MenuButtonColumnToggleEventDetail> {
    target: TableColumnMenuButton;
}
export interface TableColumnMenuButtonBeforeToggleEvent extends CustomEvent<MenuButtonColumnToggleEventDetail> {
    target: TableColumnMenuButton;
}
