export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Color = 'color'
}

export enum ThemeProviderAdaptiveTheme {
    Platform = 'platform'
}

export type ThemeProviderTheme = Theme | ThemeProviderAdaptiveTheme;

export type ThemeProviderThemeProperty = ThemeProviderTheme | null | undefined;

export type ThemeProviderThemeAttribute = `${ThemeProviderTheme}`;
