export const ChipAppearance = {
    outline: 'outline',
    block: 'block'
} as const;
export type ChipAppearance =
    (typeof ChipAppearance)[keyof typeof ChipAppearance];
