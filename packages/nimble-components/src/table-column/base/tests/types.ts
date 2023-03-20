export const ExampleSortType = {
    none: 'None',
    firstColumnAscending: 'FirstColumnAscending',
    firstColumnDescending: 'FirstColumnDescending',
    secondColumnDescendingFirstColumnAscending:
        'SecondColumnDescendingFirstColumnAscending'
} as const;
export type ExampleSortType =
    (typeof ExampleSortType)[keyof typeof ExampleSortType];
