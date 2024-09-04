/**
 * Autocomplete values for combobox.
 * @public
 */
export const ComboboxAutocomplete = {
    inline: 'inline',
    list: 'list',
    none: 'none'
} as const;
export type ComboboxAutocomplete =
    (typeof ComboboxAutocomplete)[keyof typeof ComboboxAutocomplete];
