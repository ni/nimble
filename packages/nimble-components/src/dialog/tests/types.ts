export const ExampleContentType = {
    shortContent: 'ShortContent',
    longContent: 'LongContent'
} as const;
export type ExampleContentType =
    typeof ExampleContentType[keyof typeof ExampleContentType];
