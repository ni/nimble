export const PropertyFormat = {
    SCSS: 'SCSS',
    CSS: 'CSS'
} as const;
export type PropertyFormat = typeof PropertyFormat[keyof typeof PropertyFormat];