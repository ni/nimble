import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const tableLabelDefaults: { readonly [key in TokenName]: string } = {
    tableGroupCollapseLabel: 'Collapse group',
    tableGroupExpandLabel: 'Expand group',
    tableGroupsCollapseAllLabel: 'Collapse all groups',
    tableCellActionMenuLabel: 'Options',
    tableColumnHeaderGroupedIndicatorLabel: 'Grouped',
    tableColumnHeaderSortedAscendingIndicatorLabel: 'Sorted ascending',
    tableColumnHeaderSortedDescendingIndicatorLabel: 'Sorted descending',
    tableSelectAllLabel: 'Select all rows',
    tableGroupSelectAllLabel: 'Select all rows in group',
    tableRowSelectLabel: 'Select row'
};
