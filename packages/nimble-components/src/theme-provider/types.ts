export const Theme = {
    Light: 'light',
    Dark: 'dark',
    Color: 'color'
} as const;
export type Theme = typeof Theme[keyof typeof Theme];
