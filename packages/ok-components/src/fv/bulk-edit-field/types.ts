export const BulkEditFieldStatus = {
    unchanged: 'unchanged',
    mixed: 'mixed',
    changed: 'changed',
    willClear: 'will-clear'
} as const;

export type BulkEditFieldStatus = (typeof BulkEditFieldStatus)[keyof typeof BulkEditFieldStatus];
