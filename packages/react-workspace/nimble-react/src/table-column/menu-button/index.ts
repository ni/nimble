import { TableColumnMenuButton } from '@ni/nimble-components/dist/esm/table-column/menu-button';
import { type MenuButtonColumnToggleEventDetail } from '@ni/nimble-components/dist/esm/table-column/menu-button/types';
import { wrap, type EventName } from '../../utilities/react-wrapper';

export { type TableColumnMenuButton };
export const NimbleTableColumnMenuButton = wrap(TableColumnMenuButton, {
    events: {
        onToggle: 'menu-button-column-toggle' as EventName<TableColumnMenuButtonToggleEvent>,
        onBeforeToggle: 'menu-button-column-beforetoggle' as EventName<TableColumnMenuButtonBeforeToggleEvent>,
    }
});
export interface TableColumnMenuButtonToggleEvent extends CustomEvent<MenuButtonColumnToggleEventDetail> {
    target: TableColumnMenuButton;
}
export interface TableColumnMenuButtonBeforeToggleEvent extends CustomEvent<MenuButtonColumnToggleEventDetail> {
    target: TableColumnMenuButton;
}
