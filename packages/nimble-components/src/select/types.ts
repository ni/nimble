/**
 * Types of dropdown appearance.
 * @public
 */

export { DropdownAppearance } from '../patterns/dropdown/types';

/**
 * Types of select filter mode.
 * @public
 */
export const FilterMode = {
    none: 'none',
    standard: 'standard'
} as const;
export type FilterMode = (typeof FilterMode)[keyof typeof FilterMode];
