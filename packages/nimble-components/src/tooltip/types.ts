/**
 * Types of tooltip appearance.
 * @public
 */
export const TooltipStatus = {
    default: '',
    fail: 'fail',
    information: 'information',
} as const;

export type TooltipStatus =
    typeof TooltipStatus[keyof typeof TooltipStatus];
