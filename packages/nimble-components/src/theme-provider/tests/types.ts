export const PropertyFormat = {
    scss: 'SCSS',
    css: 'CSS'
} as const;
export type PropertyFormat = typeof PropertyFormat[keyof typeof PropertyFormat];
