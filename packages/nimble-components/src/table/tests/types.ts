export const ExampleDataType = {
    simpleData: 'SimpleData',
    largeDataSet: 'LargeDataSet',
    hierarchicalDataSet: 'HierarchicalDataSet',
    leafHierarchicalDataSet: 'LeafHierarchicalDataSet'
} as const;
export type ExampleDataType =
    (typeof ExampleDataType)[keyof typeof ExampleDataType];
