export enum Theme {
    Light = 'light',
    Dark = 'dark',
    Color = 'color'
}
export type ThemeAttribute = `${Theme}` | 'prefers-color-scheme';
