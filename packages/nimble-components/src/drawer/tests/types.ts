export const ExampleContentType = {
    simpleTextContent: 'SimpleTextContent',
    headerContentFooter: 'HeaderContentFooter'
} as const;
export type ExampleContentType =
    (typeof ExampleContentType)[keyof typeof ExampleContentType];

export const DrawerWidthOptions = {
    default: 'Default',
    small300: 'Small300',
    medium500: 'Medium500',
    fitContent: 'FitContent'
} as const;
export type DrawerWidthOptions =
    (typeof DrawerWidthOptions)[keyof typeof DrawerWidthOptions];
