export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Color = 'color'
}

export enum ThemeProviderDerivedTheme {
    PrefersColorScheme = 'prefers-color-scheme'
}

export type ThemeProviderTheme =
    | Theme
    | ThemeProviderDerivedTheme;

export type ThemeProviderThemeProperty = ThemeProviderTheme | null | undefined;
export type ThemeProviderThemeAttribute = `${ThemeProviderTheme}`;
