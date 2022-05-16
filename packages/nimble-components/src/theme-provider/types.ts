export const Theme = {
    light: 'light',
    dark: 'dark',
    color: 'color'
} as const;
export type Theme = typeof Theme[keyof typeof Theme];
