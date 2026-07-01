// States shared across the `field-sizing` matrix stories of the various
// text-input-like components (text-field, text-area, number-field, combobox).
// Only states that are naturally identical across those components live here;
// component-specific dimensions (width, value, etc.) stay in each story file.

export const fieldSizingStates = [
    ['Default', ''],
    ['Content', 'field-sizing: content;']
] as const;
export type FieldSizingState = (typeof fieldSizingStates)[number];

export const fieldSizingErrorStates = [
    ['None', undefined],
    ['Visible', 'Error text is helpful']
] as const;
export type FieldSizingErrorState = (typeof fieldSizingErrorStates)[number];

export const fieldSizingLabelStates = [
    ['Short', 'Label'],
    ['Long', 'A longer label that is much longer than the default width']
] as const;
export type FieldSizingLabelState = (typeof fieldSizingLabelStates)[number];
