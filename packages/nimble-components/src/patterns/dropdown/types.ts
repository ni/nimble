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
    (typeof DropdownPosition)[keyof typeof DropdownPosition];

export const DropdownAppearance = {
    underline: 'underline',
    outline: 'outline',
    block: 'block'
} as const;
export type DropdownAppearance =
    (typeof DropdownAppearance)[keyof typeof DropdownAppearance];

/**
 * This interface is leveraged by the ListOption so that it can call
 * a method on the Select to ensure that its display style is correct
 * according to the current selected list option state.
 * @internal
 */
export interface ForceUpdateDisplayValue {
    updateDisplayValue: () => void;
}
