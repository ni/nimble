export const ExampleDataType = {
    plainString: 'PlainString',
    markdownString: 'MarkdownString'
} as const;
export type ExampleDataType =
    (typeof ExampleDataType)[keyof typeof ExampleDataType];
