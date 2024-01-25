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

export const tableRowCollapseLabel = DesignToken.create<string>({
    name: 'table-row-collapse-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableRowCollapseLabel);

export const tableRowExpandLabel = DesignToken.create<string>({
    name: 'table-row-expand-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableRowExpandLabel);

export const tableCollapseAllLabel = DesignToken.create<string>({
    name: 'table-collapse-all-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableCollapseAllLabel);

export const tableCellActionMenuLabel = DesignToken.create<string>({
    name: 'table-cell-action-menu-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableCellActionMenuLabel);

export const tableColumnHeaderGroupedLabel = DesignToken.create<string>({
    name: 'table-column-header-grouped-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableColumnHeaderGroupedLabel);

export const tableColumnHeaderSortedAscendingLabel = DesignToken.create<string>(
    {
        name: 'table-column-header-sorted-ascending-label',
        cssCustomPropertyName: null
    }
).withDefault(tableLabelDefaults.tableColumnHeaderSortedAscendingLabel);

export const tableColumnHeaderSortedDescendingLabel = DesignToken.create<string>({
    name: 'table-column-header-sorted-descending-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableColumnHeaderSortedDescendingLabel);

export const tableSelectAllLabel = DesignToken.create<string>({
    name: 'table-select-all-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableSelectAllLabel);

export const tableGroupSelectAllLabel = DesignToken.create<string>({
    name: 'table-group-select-all-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableGroupSelectAllLabel);

export const tableRowSelectLabel = DesignToken.create<string>({
    name: 'table-row-select-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableRowSelectLabel);

export const tableRowOperationColumnLabel = DesignToken.create<string>({
    name: 'table-row-operation-column-label',
    cssCustomPropertyName: null
}).withDefault(tableLabelDefaults.tableRowOperationColumnLabel);
