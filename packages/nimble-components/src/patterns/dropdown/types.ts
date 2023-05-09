export const DropdownAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block'
} as const;
export type DropdownAppearance =
    (typeof DropdownAppearance)[keyof typeof DropdownAppearance];
