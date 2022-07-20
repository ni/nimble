/**
 * Predefined icon status states
 * @public
 */
export const IconStatus = {
    fail: 'fail',
    warning: 'warning',
    pass: 'pass',
    regular: 'regular',
    information: 'information'
} as const;
export type IconStatus = typeof IconStatus[keyof typeof IconStatus];
