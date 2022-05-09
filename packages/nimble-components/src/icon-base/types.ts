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
export type IconStatusAttribute = typeof IconStatus[keyof typeof IconStatus];
