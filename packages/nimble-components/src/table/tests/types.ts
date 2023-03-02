export const ExampleDataType = {
    simpleData: 'SimpleData',
    largeDataSet: 'LargeDataSet'
} as const;
export type ExampleDataType =
    (typeof ExampleDataType)[keyof typeof ExampleDataType];

export const ExampleSortType = {
    firstColumnAscending: 'FirstColumnAscending',
    firstColumnDescending: 'FirstColumnDescending',
    firstColumnAscendingSecondColumnDescending: 'FirstColumnAscendingSecondColumnDescending'
} as const;
export type ExampleSortType =
    (typeof ExampleSortType)[keyof typeof ExampleSortType];
