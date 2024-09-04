/**
 * Autocomplete values for combobox.
 * @public
 */
export const ComboboxAutocomplete = {
    list: 'list',
    none: 'none'
} as const;
export type ComboboxAutocomplete =
    (typeof ComboboxAutocomplete)[keyof typeof ComboboxAutocomplete];
