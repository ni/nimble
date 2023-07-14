import { DesignToken } from '@microsoft/fast-foundation';
import { tableLabelDefaults } from './label-token-defaults';

export const tableGroupCollapseLabel = DesignToken.create<string>({
    name: 'table-group-collapse-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableGroupCollapseLabel);

export const tableGroupExpandLabel = DesignToken.create<string>({
    name: 'table-group-expand-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableGroupExpandLabel);

export const tableGroupsCollapseAllLabel = DesignToken.create<string>({
    name: 'table-groups-collapse-all-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableGroupsCollapseAllLabel);

export const tableCellActionMenuLabel = DesignToken.create<string>({
    name: 'table-cell-action-menu-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableCellActionMenuLabel);

export const tableColumnHeaderGroupedIndicatorLabel = DesignToken.create<string>({
    name: 'table-column-header-grouped-indicator-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableColumnHeaderGroupedIndicatorLabel);
