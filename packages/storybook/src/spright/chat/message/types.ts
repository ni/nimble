export const ExampleWelcomeSlotContent = {
    none: 'none',
    loginButton: 'loginButton',
    suggestions: 'suggestions'
} as const;
export type ExampleWelcomeSlotContent = (typeof ExampleWelcomeSlotContent)[keyof typeof ExampleWelcomeSlotContent];
