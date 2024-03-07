import type { ListOption } from '../../list-option';
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
 * @internal
 *
 * This interface is used to register options with their parent once their
 * 'connectedCallback' method is run. This allows for the "owner", like the
 * Select, to have its value set to that newly registered option earlier than it
 * might otherwise in certain situations. One such scenario is in an Angular
 * reactive form, where the form value is set to an option immediately after
 * dynamically adding it.
 */
export interface DropdownOwner {
    registerOption: (option: ListOption) => void;
}
