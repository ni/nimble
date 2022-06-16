import { ComboboxAutocomplete as FastComboboxAutocomplete } from '@microsoft/fast-foundation';

export const ComboboxAutocomplete = {
    /**
     * Automatically matches the first option that matches the start of the entered text.
     */
    inline: FastComboboxAutocomplete.inline,

    /**
     * Filters the dropdown to options that start with the entered text.
     */
    list: FastComboboxAutocomplete.list,

    /**
     * Automatically matches and filters list to options that start with the entered text.
     */
    both: FastComboboxAutocomplete.both,

    /**
      * Performs no autocomplete behavior.
      */
    none: FastComboboxAutocomplete.none
} as const;
export type ComboboxAutocomplete =
    typeof ComboboxAutocomplete[keyof typeof ComboboxAutocomplete];
