export const ExampleContentType = {
    simpleTextContent: 'SimpleTextContent',
    headerContentFooter: 'HeaderContentFooter'
} as const;
export type ExampleContentType =
    typeof ExampleContentType[keyof typeof ExampleContentType];
