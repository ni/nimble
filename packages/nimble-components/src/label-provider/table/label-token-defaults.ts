import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const tableLabelDefaults: { readonly [key in TokenName]: string } = {
    tableGroupCollapseLabel: 'Collapse group',
    tableGroupExpandLabel: 'Expand group',
    tableRowCollapseLabel: 'Collapse row',
    tableRowExpandLabel: 'Expand row',
    tableCollapseAllLabel: 'Collapse all',
    tableCellActionMenuLabel: 'Options',
    tableColumnHeaderGroupedLabel: 'Grouped',
    tableColumnHeaderSortedAscendingLabel: 'Sorted ascending',
    tableColumnHeaderSortedDescendingLabel: 'Sorted descending',
    tableSelectAllLabel: 'Select all rows',
    tableGroupSelectAllLabel: 'Select all rows in group',
    tableRowSelectLabel: 'Select row',
    tableRowOperationColumnLabel: 'Row operations'
};
