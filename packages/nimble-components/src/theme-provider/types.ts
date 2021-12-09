export type NimbleThemeValue = 'light' | 'dark' | 'color' | 'legacy-blue';
export enum NimbleTheme {
    Light = 'light',
    Dark = 'dark',
    Color = 'color',
    LegacyBlue = 'legacy-blue' // ⛔️ only for use within SystemLink apps that haven't been updated to brand-aligned controls
}
