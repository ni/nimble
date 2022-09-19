export const ExampleContentType = {
    simpleTextContent: 'SimpleTextContent',
    headerContentFooter: 'HeaderContentFooter'
} as const;
export type ExampleContentType =
    typeof ExampleContentType[keyof typeof ExampleContentType];

export const DialogWidthOptions = {
    default: 'Default',
    small300: 'Small300',
    large600: 'Large500',
    fitContent: 'FitContent'
} as const;
export type DialogWidthOptions =
    typeof DialogWidthOptions[keyof typeof DialogWidthOptions];
