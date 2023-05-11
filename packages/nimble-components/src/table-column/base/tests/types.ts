export const ExampleSortType = {
    none: 'None',
    firstColumnAscending: 'FirstColumnAscending',
    firstColumnDescending: 'FirstColumnDescending',
    secondColumnDescendingFirstColumnAscending:
        'SecondColumnDescendingFirstColumnAscending',
    firstColumnAscendingSecondColumnDisabled:
        'FirstColumnAscendingSecondColumnDisabled'
} as const;
export type ExampleSortType =
    (typeof ExampleSortType)[keyof typeof ExampleSortType];

export const ExampleGroupType = {
    none: 'None',
    firstName: 'FirstName',
    lastName: 'LastName',
    firstThenLastName: 'FirstThenLastName',
    lastThenFirstName: 'LastThenFirstName',
    age: 'Age'
} as const;
export type ExampleGroupType =
    (typeof ExampleGroupType)[keyof typeof ExampleGroupType];

export const ExampleGroupingDisabledType = {
    firstName: 'FirstName',
    lastName: 'LastName'
} as const;
export type ExampleGroupingDisabledType =
    (typeof ExampleGroupingDisabledType)[keyof typeof ExampleGroupingDisabledType];

export const ExampleColumnFractionalWidthType = {
    default: 'Default',
    firstColumnHalfSize: 'FirstColumnHalfSize',
    firstColumTwiceSize: 'FirstColumnTwiceSize',
    thirdColumnHalfFourthColumnTwice: 'ThirdColumnHalfFourthColumnTwice'
} as const;
export type ExampleColumnFractionalWidthType =
    (typeof ExampleColumnFractionalWidthType)[keyof typeof ExampleColumnFractionalWidthType];
