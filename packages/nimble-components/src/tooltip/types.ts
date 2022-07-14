/**
 * Types of tooltip appearance.
 * @public
 */
export const TooltipStatus = {
    default: '',
    information: 'information',
    warning: 'warning'
} as const;

export type TooltipStatus =
    typeof TooltipStatus[keyof typeof TooltipStatus];
