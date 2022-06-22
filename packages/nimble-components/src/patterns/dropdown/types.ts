import { SelectPosition } from '@microsoft/fast-foundation';

export const DropdownPosition = {
    above: SelectPosition.above,
    below: SelectPosition.below
} as const;
export type DropdownPosition =
    typeof DropdownPosition[keyof typeof DropdownPosition];

export const DropdownAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block'
} as const;
export type DropdownAppearance =
    typeof DropdownAppearance[keyof typeof DropdownAppearance];
