export const TestAppearance = {
    default: undefined,
    awesome: 'awesome',
    best: 'best'
} as const;
export type TestAppearance = typeof TestAppearance[keyof typeof TestAppearance];
