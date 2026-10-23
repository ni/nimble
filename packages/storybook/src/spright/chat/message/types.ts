export const ExampleWelcomeSlotContent = {
    none: 'none',
    loginButton: 'loginButton',
    suggestions: 'suggestions'
} as const;
export type ExampleWelcomeSlotContent = (typeof ExampleWelcomeSlotContent)[keyof typeof ExampleWelcomeSlotContent];

export const ExampleWelcomeSubtitleSlot = {
    none: 'none',
    richContent: 'richContent'
} as const;
export type ExampleWelcomeSubtitleSlot = (typeof ExampleWelcomeSubtitleSlot)[keyof typeof ExampleWelcomeSubtitleSlot];
