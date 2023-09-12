import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { DesignTokensFor, LabelProviderBase } from '../base';
import {
    tableCellActionMenuLabel,
    tableColumnHeaderGroupedIndicatorLabel,
    tableColumnHeaderSortedAscendingIndicatorLabel,
    tableColumnHeaderSortedDescendingIndicatorLabel,
    tableGroupCollapseLabel,
    tableGroupExpandLabel,
    tableGroupSelectAllLabel,
    tableGroupsCollapseAllLabel,
    tableRowSelectLabel,
    tableSelectAllLabel
} from './label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-table': LabelProviderTable;
    }
}

const supportedLabels = {
    groupCollapse: tableGroupCollapseLabel,
    groupExpand: tableGroupExpandLabel,
    groupsCollapseAll: tableGroupsCollapseAllLabel,
    cellActionMenu: tableCellActionMenuLabel,
    columnHeaderGroupedIndicator: tableColumnHeaderGroupedIndicatorLabel,
    columnHeaderSortedAscendingIndicator:
        tableColumnHeaderSortedAscendingIndicatorLabel,
    columnHeaderSortedDescendingIndicator:
        tableColumnHeaderSortedDescendingIndicatorLabel,
    selectAll: tableSelectAllLabel,
    groupSelectAll: tableGroupSelectAllLabel,
    rowSelect: tableRowSelectLabel
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

    @attr({ attribute: 'column-header-grouped-indicator' })
    public columnHeaderGroupedIndicator: string | undefined;

    @attr({ attribute: 'column-header-sorted-ascending-indicator' })
    public columnHeaderSortedAscendingIndicator: string | undefined;

    @attr({ attribute: 'column-header-sorted-descending-indicator' })
    public columnHeaderSortedDescendingIndicator: string | undefined;

    @attr({ attribute: 'select-all' })
    public selectAll: string | undefined;

    @attr({ attribute: 'group-select-all' })
    public groupSelectAll: string | undefined;

    @attr({ attribute: 'row-select' })
    public rowSelect: string | undefined;

    protected override readonly supportedLabels = supportedLabels;
}

const nimbleLabelProviderTable = LabelProviderTable.compose({
    baseName: 'label-provider-table'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderTable());
export const labelProviderTableTag = DesignSystem.tagFor(LabelProviderTable);
