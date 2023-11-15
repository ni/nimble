export const ExampleOptionsType = {
    simpleOptions: 'SimpleOptions',
    wideOptions: 'WideOptions',
    longOptions: 'LongOptions'
} as const;
export type ExampleOptionsType =
    (typeof ExampleOptionsType)[keyof typeof ExampleOptionsType];
