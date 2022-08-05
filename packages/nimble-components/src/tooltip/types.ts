/**
 * Types of tooltip appearance.
 * @public
 */
export const TooltipAppearance = {
    default: undefined,
    error: 'error',
    information: 'information'
} as const;

export type TooltipAppearance = typeof TooltipAppearance[keyof typeof TooltipAppearance];
