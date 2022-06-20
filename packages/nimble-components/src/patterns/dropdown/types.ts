import { SelectPosition } from '@microsoft/fast-foundation';

export const DropdownPosition = {
    above: SelectPosition.above,
    below: SelectPosition.below
} as const;
export type DropdownPosition =
    typeof DropdownPosition[keyof typeof DropdownPosition];

export const SelectAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block'
} as const;
export type SelectAppearance =
    typeof SelectAppearance[keyof typeof SelectAppearance];