/**
 * An option in an FV multi-select. Values must be unique.
 */
export interface FvMultiSelectOption {
    value: string;
    label: string;
    disabled?: boolean;
}
