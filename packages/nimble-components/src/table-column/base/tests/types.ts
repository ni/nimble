export const ExampleSortType = {
    none: 'None',
    firstColumnAscending: 'FirstColumnAscending',
    firstColumnDescending: 'FirstColumnDescending',
    secondColumnDescendingFirstColumnAscending:
        'SecondColumnDescendingFirstColumnAscending'
} as const;
export type ExampleSortType =
    (typeof ExampleSortType)[keyof typeof ExampleSortType];

export const ExampleColumnFractionalWidthType = {
    default: 'Default',
    firstColumnHalfSize: 'FirstColumnHalfSize',
    firstColumTwiceSize: 'FirstColumnTwiceSize',
    thirdColumnHalfFourthColumnTwice: 'ThirdColumnHalfFourthColumnTwice'
} as const;
export type ExampleColumnFractionalWidthType =
    (typeof ExampleColumnFractionalWidthType)[keyof typeof ExampleColumnFractionalWidthType];
