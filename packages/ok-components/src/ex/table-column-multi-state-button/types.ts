/**
 * The type of the detail associated with the `ex-multi-state-button-column-toggle` events on the
 * Ex multi-state button column.
 */
export interface ExMultiStateButtonColumnToggleEventDetail {
    recordId: string;
}

/**
 * Values for the state (value) of an Ex multi-state button view in a table cell
 */
export const ExMultiStateButtonState = {
    A: 'A',
    B: 'B',
    C: 'C'
} as const;

export type ExMultiStateButtonState = (typeof ExMultiStateButtonState)[keyof typeof ExMultiStateButtonState];
