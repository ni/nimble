export const ExampleDataType = {
    simpleData: 'SimpleData',
    largeDataSet: 'LargeDataSet',
    hierarchicalDataSet: 'HierarchicalDataSet'
} as const;
export type ExampleDataType =
    (typeof ExampleDataType)[keyof typeof ExampleDataType];
