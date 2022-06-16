/**
 * Predefined icon status states
 * @public
 */
export const TooltipStatus = {
    default: 'default',
    error: 'error',
    information: 'information',
} as const;
export type TooltipStatus = typeof TooltipStatus[keyof typeof TooltipStatus];