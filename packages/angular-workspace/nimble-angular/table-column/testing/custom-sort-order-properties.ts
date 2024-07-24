export const sortByFieldName1 = 'sort-by-field-1' as const;
export const sortByFieldName2 = 'sort-by-field-2' as const;

export const customSortOrderProperties = [
    { name: 'sortByFieldName', property: 'sortByFieldName', defaultValue: undefined, value1: sortByFieldName1, value2: sortByFieldName2 }
] as const;