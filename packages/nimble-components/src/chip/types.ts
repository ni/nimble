export const ChipAppearance = {
    outline: 'outline',
    block: 'block'
} as const;
export type ChipAppearance =
    (typeof ChipAppearance)[keyof typeof ChipAppearance];

export const ChipSelectionMode = {
    none: undefined,
    single: 'single'
} as const;
export type ChipSelectionMode =
    (typeof ChipSelectionMode)[keyof typeof ChipSelectionMode];
