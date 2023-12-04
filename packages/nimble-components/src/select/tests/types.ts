export const ExampleOptionsType = {
    simpleOptions: 'SimpleOptions',
    wideOptions: 'WideOptions',
    manyOptions: 'ManyOptions'
} as const;
export type ExampleOptionsType =
    (typeof ExampleOptionsType)[keyof typeof ExampleOptionsType];
