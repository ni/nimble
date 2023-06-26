import { attr } from '@microsoft/fast-element';
import { DesignSystem } from '@microsoft/fast-foundation';
import { LabelProviderBase } from '../base';
import {
    tableCellActionMenuLabel,
    tableColumnHeaderGroupedIndicatorLabel,
    tableGroupCollapseLabel,
    tableGroupExpandLabel,
    tableGroupsCollapseAllLabel
} from './label-tokens';
import { tableLabelDefaults } from './label-token-defaults';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-label-provider-table': LabelProviderTable;
    }
}

/**
 * Label provider for the Nimble table (and its sub-components and columns)
 */
export class LabelProviderTable extends LabelProviderBase {
    public override readonly labelTokens = {
        tableGroupCollapseLabel,
        tableGroupExpandLabel,
        tableGroupsCollapseAllLabel,
        tableCellActionMenuLabel,
        tableColumnHeaderGroupedIndicatorLabel
    };

    @attr({
        attribute: 'group-collapse',
        mode: 'fromView'
    })
    public groupCollapse = tableLabelDefaults.tableGroupCollapseLabel;

    @attr({
        attribute: 'group-expand',
        mode: 'fromView'
    })
    public groupExpand = tableLabelDefaults.tableGroupExpandLabel;

    @attr({
        attribute: 'groups-collapse-all',
        mode: 'fromView'
    })
    public groupsCollapseAll = tableLabelDefaults.tableGroupsCollapseAllLabel;

    @attr({
        attribute: 'cell-action-menu',
        mode: 'fromView'
    })
    public cellActionMenu = tableLabelDefaults.tableCellActionMenuLabel;

    @attr({
        attribute: 'column-header-grouped-indicator',
        mode: 'fromView'
    })
    public columnHeaderGroupedIndicator = tableLabelDefaults.tableColumnHeaderGroupedIndicatorLabel;

    protected groupCollapseChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        this.handleTokenChanged(tableGroupCollapseLabel, next);
    }

    protected groupExpandChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        this.handleTokenChanged(tableGroupExpandLabel, next);
    }

    protected groupsCollapseAllChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        this.handleTokenChanged(tableGroupsCollapseAllLabel, next);
    }

    protected cellActionMenuChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        this.handleTokenChanged(tableCellActionMenuLabel, next);
    }

    protected columnHeaderGroupedIndicatorChanged(
        _prev: string | undefined,
        next: string | undefined
    ): void {
        this.handleTokenChanged(tableColumnHeaderGroupedIndicatorLabel, next);
    }
}

const nimbleLabelProviderTable = LabelProviderTable.compose({
    baseName: 'label-provider-table'
});

DesignSystem.getOrCreate()
    .withPrefix('nimble')
    .register(nimbleLabelProviderTable());
export const labelProviderTableTag = DesignSystem.tagFor(LabelProviderTable);
