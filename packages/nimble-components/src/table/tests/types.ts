export const ExampleDataType = {
    simpleData: 'SimpleData',
    largeDataSet: 'LargeDataSet'
} as const;
export type ExampleDataType =
    (typeof ExampleDataType)[keyof typeof ExampleDataType];
