export const ExampleSortType = {
    firstColumnAscending: 'FirstColumnAscending',
    firstColumnDescending: 'FirstColumnDescending',
    firstColumnAscendingSecondColumnDescending:
        'FirstColumnAscendingSecondColumnDescending'
} as const;
export type ExampleSortType =
    (typeof ExampleSortType)[keyof typeof ExampleSortType];
