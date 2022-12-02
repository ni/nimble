export const SpinnerThemeVariant = {
    default: undefined,
    prominent: 'prominent'
} as const;
export type SpinnerThemeVariant =
    typeof SpinnerThemeVariant[keyof typeof SpinnerThemeVariant];

export const SpinnerSize = {
    small: 'small',
    medium: 'medium',
    large: 'large'
} as const;
export type SpinnerSize = typeof SpinnerSize[keyof typeof SpinnerSize];
