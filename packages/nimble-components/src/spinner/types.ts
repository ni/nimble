export const SpinnerSize = {
    xSmall: 'x-small', // 16px
    small: undefined, // 32px
    medium: 'medium', // 48px
    large: 'large', // 64px
    xLarge: 'x-large', // 96px
    xxLarge: 'xx-large' // 128px
} as const;
export type SpinnerSize = typeof SpinnerSize[keyof typeof SpinnerSize];
