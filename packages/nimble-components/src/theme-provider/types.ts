export type ThemeAttribute = 'light' | 'dark' | 'color' | 'legacyblue';
export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Color = 'color',
    LegacyBlue = 'legacyblue' // ⛔️ only for use within SystemLink apps that haven't been updated to brand-aligned controls
}
