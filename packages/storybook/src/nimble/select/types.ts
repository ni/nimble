export const ExampleOptionsType = {
    simpleOptions: 'SimpleOptions',
    placeholderOptions: 'PlaceholderOptions',
    wideOptions: 'WideOptions',
    manyOptions: 'ManyOptions',
    groupedOptions: 'GroupedOptions'
} as const;
export type ExampleOptionsType =
    (typeof ExampleOptionsType)[keyof typeof ExampleOptionsType];
