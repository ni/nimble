/**
 * Types of tooltip appearance.
 * @public
 */
export const TooltipSeverity = {
    default: undefined,
    error: 'error',
    information: 'information'
} as const;

export type TooltipSeverity =
    typeof TooltipSeverity[keyof typeof TooltipSeverity];
