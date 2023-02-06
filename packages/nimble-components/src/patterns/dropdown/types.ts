import type { ErrorPattern } from '../error/types';

/**
 * The interface that dropdowns of various types implement. The properties in this interface
 * are leveraged by the shared dropdown pattern css.
 */
export interface DropdownPattern extends ErrorPattern {
    position?: DropdownPosition;
}

export const DropdownPosition = {
    above: 'above',
    below: 'below'
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
