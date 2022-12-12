export const ExampleDataType = {
    simpleData: 'SimpleData'
} as const;
export type ExampleDataType =
    typeof ExampleDataType[keyof typeof ExampleDataType];
