import { TableColumnSortDirection } from '@ni/nimble-angular/table-column';

export const sortDirection1 = TableColumnSortDirection.ascending;
export const sortDirection2 = TableColumnSortDirection.descending;
export const sortIndex1 = 0 as const;
export const sortIndex2 = 1 as const;
export const sortingDisabled1 = true as const;
export const sortingDisabled2 = false as const;

export const sortableColumnProperties = [
    { name: 'sortDirection', property: 'sortDirection', defaultValue: undefined, value1: sortDirection1, value2: sortDirection2 },
    { name: 'sortIndex', property: 'sortIndex', defaultValue: undefined, value1: sortIndex1, value2: sortIndex2 },
    { name: 'sortingDisabled', property: 'sortingDisabled', defaultValue: false, value1: sortingDisabled1, value2: sortingDisabled2 }
] as const;