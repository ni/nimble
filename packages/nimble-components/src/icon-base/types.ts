/**
 * Predefined icon status states
 * @public
 */
export const IconStatus = {
    Fail: 'fail',
    Warning: 'warning',
    Pass: 'pass',
    Regular: 'regular'
} as const;
export type IconStatus = typeof IconStatus[keyof typeof IconStatus];
