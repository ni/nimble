/**
 * Predefined icon appearance states
 * @public
 */
export const IconAppearance = {
    default: undefined,
    error: 'error',
    warning: 'warning',
    success: 'success',
    information: 'information'
} as const;
export type IconAppearance = typeof IconAppearance[keyof typeof IconAppearance];
