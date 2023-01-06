export const SpinnerSize = {
    default: undefined,
    medium: 'medium',
    large: 'large'
} as const;
export type SpinnerSize = typeof SpinnerSize[keyof typeof SpinnerSize];
