/**
 * The aligment of the value in a TableColumnTextCellViewBase instance.
 */
export const TextCellViewBaseAlignment = {
    left: 'left',
    right: 'right'
} as const;
export type TextCellViewBaseAlignment =
    (typeof TextCellViewBaseAlignment)[keyof typeof TextCellViewBaseAlignment];
