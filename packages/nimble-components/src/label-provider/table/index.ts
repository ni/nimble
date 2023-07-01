import { attr } from '@microsoft/fast-element';
import { DesignSystem, DesignToken } from '@microsoft/fast-foundation';
import { LabelProviderBase } from '../base';
import {
    tableCellActionMenuLabel,
    tableColumnHeaderGroupedIndicatorLabel,
    tableGroupCollapseLabel,
    tableGroupExpandLabel,
    tableGroupsCollapseAllLabel
} from './label-tokens';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-table': LabelProviderTable;
    }
}

/**
 * Label provider for the Nimble table (and its sub-components and columns)
 */
export class LabelProviderTable extends LabelProviderBase {
    @attr({ attribute: 'group-collapse' })
    public groupCollapse?: string;

    @attr({ attribute: 'group-expand' })
    public groupExpand?: string;

    @attr({ attribute: 'groups-collapse-all' })
    public groupsCollapseAll?: string;

    @attr({ attribute: 'cell-action-menu' })
    public cellActionMenu?: string;

    @attr({ attribute: 'column-header-grouped-indicator' })
    public columnHeaderGroupedIndicator?: string;

    public constructor() {
        const supportedLabels: {
            [P in keyof LabelProviderTable]?: DesignToken<string>;
        } = {
            groupCollapse: tableGroupCollapseLabel,
            groupExpand: tableGroupExpandLabel,
            groupsCollapseAll: tableGroupsCollapseAllLabel,
            cellActionMenu: tableCellActionMenuLabel,
            columnHeaderGroupedIndicator: tableColumnHeaderGroupedIndicatorLabel
        };
        super(supportedLabels);
    }
}

const nimbleLabelProviderTable = LabelProviderTable.compose({
    baseName: 'label-provider-table'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderTable());
export const labelProviderTableTag = DesignSystem.tagFor(LabelProviderTable);
