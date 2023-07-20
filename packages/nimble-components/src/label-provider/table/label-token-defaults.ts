import type * as TokensNamespace from './label-tokens';

type TokenName = keyof typeof TokensNamespace;

export const tableLabelDefaults: { readonly [key in TokenName]: string } = {
    tableGroupCollapseLabel: 'Collapse group',
    tableGroupExpandLabel: 'Expand group',
    tableGroupsCollapseAllLabel: 'Collapse all groups',
    tableCellActionMenuLabel: 'Options',
    tableColumnHeaderGroupedIndicatorLabel: 'Grouped'
};
