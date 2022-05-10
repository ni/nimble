export const ExampleContentType = {
    SimpleTextContent: 'SimpleTextContent',
    HeaderContentFooter: 'HeaderContentFooter'
} as const;
export type ExampleContentType = typeof ExampleContentType[keyof typeof ExampleContentType];

export const DrawerWidthOptions = {
    Default: 'Default',
    Small300: 'Small300',
    Medium500: 'Medium500',
    FitContent: 'FitContent'
};
export type DrawerWidthOptions = typeof DrawerWidthOptions[keyof typeof DrawerWidthOptions];