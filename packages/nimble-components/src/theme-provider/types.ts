export const Theme = {
    light: 'light',
    dark: 'dark',
    color: 'color'
} as const;
export type Theme = (typeof Theme)[keyof typeof Theme];

export const ThemeProviderTheme = {
    system: undefined,
    ...Theme
} as const;
export type ThemeProviderTheme =
    (typeof ThemeProviderTheme)[keyof typeof ThemeProviderTheme];
