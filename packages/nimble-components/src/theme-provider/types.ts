export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Color = 'color',
    LegacyBlue = 'legacy-blue' // ⛔️ only for use within SystemLink apps that haven't been updated to brand-aligned controls
}
export type ThemeAttribute = `${Theme}`;
