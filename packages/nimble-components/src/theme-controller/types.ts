import { Theme } from '../theme-provider/types';

export const ThemeControllerTheme = {
    system: undefined,
    ...Theme
} as const;
export type ThemeControllerTheme =
    (typeof ThemeControllerTheme)[keyof typeof ThemeControllerTheme];
