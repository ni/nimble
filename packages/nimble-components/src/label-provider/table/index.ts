import { attr } from '@ni/fast-element';
import { DesignSystem } from '@ni/fast-foundation';
import { type DesignTokensFor, LabelProviderBase } from '../base';
import {
    tableCellActionMenuLabel,
    tableColumnHeaderGroupedLabel,
    tableColumnHeaderSortedAscendingLabel,
    tableColumnHeaderSortedDescendingLabel,
    tableGroupCollapseLabel,
    tableGroupExpandLabel,
    tableGroupSelectAllLabel,
    tableCollapseAllLabel,
    tableRowCollapseLabel,
    tableRowExpandLabel,
    tableRowOperationColumnLabel,
    tableRowSelectLabel,
    tableSelectAllLabel,
    tableRowLoadingLabel,
    tableGroupRowPlaceholderEmptyLabel,
    tableGroupRowPlaceholderNoValueLabel
} from './label-tokens';
import { styles } from '../base/styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-table': LabelProviderTable;
    }
}

const supportedLabels = {
    groupCollapse: tableGroupCollapseLabel,
    groupExpand: tableGroupExpandLabel,
    rowCollapse: tableRowCollapseLabel,
    rowExpand: tableRowExpandLabel,
    collapseAll: tableCollapseAllLabel,
    cellActionMenu: tableCellActionMenuLabel,
    columnHeaderGrouped: tableColumnHeaderGroupedLabel,
    columnHeaderSortedAscending: tableColumnHeaderSortedAscendingLabel,
    columnHeaderSortedDescending: tableColumnHeaderSortedDescendingLabel,
    selectAll: tableSelectAllLabel,
    groupSelectAll: tableGroupSelectAllLabel,
    rowSelect: tableRowSelectLabel,
    rowOperationColumn: tableRowOperationColumnLabel,
    rowLoading: tableRowLoadingLabel,
    groupRowPlaceholderNoValue: tableGroupRowPlaceholderNoValueLabel,
    groupRowPlaceholderEmpty: tableGroupRowPlaceholderEmptyLabel
} as const;

/**
 * Label provider for the Nimble table (and its sub-components and columns)
 */
export class LabelProviderTable
    extends LabelProviderBase<typeof supportedLabels>
    implements DesignTokensFor<typeof supportedLabels> {
    @attr({ attribute: 'group-collapse' })
    public groupCollapse: string | undefined;

    @attr({ attribute: 'group-expand' })
    public groupExpand: string | undefined;

    @attr({ attribute: 'row-collapse' })
    public rowCollapse: string | undefined;

    @attr({ attribute: 'row-expand' })
    public rowExpand: string | undefined;

    @attr({ attribute: 'collapse-all' })
    public collapseAll: string | undefined;

    @attr({ attribute: 'cell-action-menu' })
    public cellActionMenu: string | undefined;

    @attr({ attribute: 'column-header-grouped' })
    public columnHeaderGrouped: string | undefined;

    @attr({ attribute: 'column-header-sorted-ascending' })
    public columnHeaderSortedAscending: string | undefined;

    @attr({ attribute: 'column-header-sorted-descending' })
    public columnHeaderSortedDescending: string | undefined;

    @attr({ attribute: 'select-all' })
    public selectAll: string | undefined;

    @attr({ attribute: 'group-select-all' })
    public groupSelectAll: string | undefined;

    @attr({ attribute: 'row-select' })
    public rowSelect: string | undefined;

    @attr({ attribute: 'row-operation-column' })
    public rowOperationColumn: string | undefined;

    @attr({ attribute: 'row-loading' })
    public rowLoading: string | undefined;

    @attr({ attribute: 'group-row-placeholder-no-value' })
    public groupRowPlaceholderNoValue: string | undefined;

    @attr({ attribute: 'group-row-placeholder-empty' })
    public groupRowPlaceholderEmpty: string | undefined;

    protected override readonly supportedLabels = supportedLabels;
}

const nimbleLabelProviderTable = LabelProviderTable.compose({
    baseName: 'label-provider-table',
    styles
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderTable());
export const labelProviderTableTag = 'nimble-label-provider-table';
