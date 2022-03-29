export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Color = 'color'
}

export enum ThemeProviderDerivedTheme {
    PrefersColorScheme = 'prefers-color-scheme'
}

export type ThemeProviderTheme = Theme | ThemeProviderDerivedTheme | undefined | null;

export type ThemeProviderThemeAttribute = `${Theme | ThemeProviderDerivedTheme}`;
