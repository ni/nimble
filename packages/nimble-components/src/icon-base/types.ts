/**
 * Predefined icon appearance states
 * @public
 */
export const IconSeverity = {
    default: undefined,
    error: 'error',
    warning: 'warning',
    success: 'success',
    information: 'information'
} as const;
export type IconSeverity = typeof IconSeverity[keyof typeof IconSeverity];
