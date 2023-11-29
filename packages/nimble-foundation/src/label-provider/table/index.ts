import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { DesignTokensFor, LabelProviderBase } from '../base';
import {
    tableCellActionMenuLabel,
    tableColumnHeaderGroupedLabel,
    tableColumnHeaderSortedAscendingLabel,
    tableColumnHeaderSortedDescendingLabel,
    tableGroupCollapseLabel,
    tableGroupExpandLabel,
    tableGroupSelectAllLabel,
    tableGroupsCollapseAllLabel,
    tableRowOperationColumnLabel,
    tableRowSelectLabel,
    tableSelectAllLabel
} from './label-tokens';

const supportedLabels = {
    groupCollapse: tableGroupCollapseLabel,
    groupExpand: tableGroupExpandLabel,
    groupsCollapseAll: tableGroupsCollapseAllLabel,
    cellActionMenu: tableCellActionMenuLabel,
    columnHeaderGrouped: tableColumnHeaderGroupedLabel,
    columnHeaderSortedAscending: tableColumnHeaderSortedAscendingLabel,
    columnHeaderSortedDescending: tableColumnHeaderSortedDescendingLabel,
    selectAll: tableSelectAllLabel,
    groupSelectAll: tableGroupSelectAllLabel,
    rowSelect: tableRowSelectLabel,
    rowOperationColumn: tableRowOperationColumnLabel
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

    @attr({ attribute: 'groups-collapse-all' })
    public groupsCollapseAll: string | undefined;

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

    protected override readonly supportedLabels = supportedLabels;
}

export const labelProviderTableTag = DesignSystem.tagFor(LabelProviderTable);
