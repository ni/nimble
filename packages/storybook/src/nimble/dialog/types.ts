export const ExampleContentType = {
    shortContent: 'ShortContent',
    longContent: 'LongContent'
} as const;
export type ExampleContentType =
    (typeof ExampleContentType)[keyof typeof ExampleContentType];

export const ExampleFooterContentType = {
    text: 'text',
    buttons: 'buttons'
} as const;
export type ExampleFooterContentType =
    (typeof ExampleFooterContentType)[keyof typeof ExampleFooterContentType];

export const DialogSizeOptions = {
    smallGrowable: 'Small growable',
    largeFixed: 'Large growable'
} as const;
export type DialogSizeOptions =
    (typeof DialogSizeOptions)[keyof typeof DialogSizeOptions];
