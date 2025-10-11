import { Table } from '@ni/nimble-components/dist/esm/table';
import type {
    TableActionMenuToggleEventDetail,
    TableRowExpansionToggleEventDetail,
    TableColumnConfigurationChangeEventDetail,
    TableRowSelectionEventDetail
} from '@ni/nimble-components/dist/esm/table/types';
import { wrap, type EventName } from '../utilities/react-wrapper';

export { type Table };
export const NimbleTable = wrap(Table, {
    events: {
        onActionMenuBeforeToggle: 'action-menu-beforetoggle' as EventName<TableActionMenuBeforeToggleEvent>,
        onActionMenuToggle: 'action-menu-toggle' as EventName<TableActionMenuToggleEvent>,
        onSelectionChange: 'selection-change' as EventName<TableSelectionChangeEvent>,
        onColumnConfigurationChange: 'column-configuration-change' as EventName<TableColumnConfigurationChangeEvent>,
        onRowExpandToggle: 'row-expand-toggle' as EventName<TableRowExpandToggleEvent>,
    }
});
export interface TableActionMenuBeforeToggleEvent extends CustomEvent<TableActionMenuToggleEventDetail> {
    target: Table;
}
export interface TableActionMenuToggleEvent extends CustomEvent<TableActionMenuToggleEventDetail> {
    target: Table;
}
export interface TableSelectionChangeEvent extends CustomEvent<TableRowSelectionEventDetail> {
    target: Table;
}
export interface TableColumnConfigurationChangeEvent extends CustomEvent<TableColumnConfigurationChangeEventDetail> {
    target: Table;
}
export interface TableRowExpandToggleEvent extends CustomEvent<TableRowExpansionToggleEventDetail> {
    target: Table;
}
