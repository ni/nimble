export const Theme = {
    Light: 'light',
    Dark: 'dark',
    Color: 'color'
} as const;
export type ThemeAttribute = typeof Theme[keyof typeof Theme];
