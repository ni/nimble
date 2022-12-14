export const SpinnerSize = {
    small: 'small',
    medium: 'medium',
    mediumLarge: 'medium-large',
    large: 'large',
    xLarge: 'x-large',
    xxLarge: 'xx-large'
} as const;
export type SpinnerSize = typeof SpinnerSize[keyof typeof SpinnerSize];
