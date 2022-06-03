import { ComboboxAutocomplete as FastComboboxAutocomplete } from '@microsoft/fast-foundation';

export const ComboboxAutocomplete = {
    inline: FastComboboxAutocomplete.inline,
    list: FastComboboxAutocomplete.list,
    both: FastComboboxAutocomplete.both,
    none: FastComboboxAutocomplete.none
} as const;
export type ComboboxAutocomplete =
    typeof ComboboxAutocomplete[keyof typeof ComboboxAutocomplete];
