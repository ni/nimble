import { Table } from '@ni/nimble-components/dist/esm/table';
import type {
    TableActionMenuToggleEventDetail,
    TableRowExpansionToggleEventDetail,
    TableColumnConfigurationChangeEventDetail,
    TableRowSelectionEventDetail
} from '@ni/nimble-components/dist/esm/table/types';
import { wrap } from '../utilities/react-wrapper';

export { type Table };
export const NimbleTable = wrap(Table, {
    events: {
        onActionMenuBeforeToggle: 'action-menu-beforetoggle',
        onActionMenuToggle: 'action-menu-toggle',
        onSelectionChange: 'selection-change',
        onColumnConfigurationChange: 'column-configuration-change',
        onRowExpandToggle: 'row-expand-toggle',
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
