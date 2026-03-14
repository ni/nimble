export const ChipAppearance = {
    outline: 'outline',
    block: 'block'
} as const;
export type ChipAppearance = (typeof ChipAppearance)[keyof typeof ChipAppearance];

export const ChipSize = {
    normal: undefined,
    small: 'small'
} as const;
export type ChipSize = (typeof ChipSize)[keyof typeof ChipSize];
