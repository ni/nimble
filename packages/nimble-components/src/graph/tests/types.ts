export const ExampleDataType = {
    singlePlot: 'SinglePlot',
    multiPlot: 'MultiPlot'
} as const;
export type ExampleDataType =
    (typeof ExampleDataType)[keyof typeof ExampleDataType];
