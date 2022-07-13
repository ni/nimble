/**
 * The interface that tooltips of various types implement.
 */
export interface ITooltip {
    /**
     * The appearance the tooltip should have.
     */
    state: TooltipStatus;
}
/**
 * Types of tooltip appearance.
 * @public
 */
export const TooltipStatus = {
    default: 'default',
    fail: 'fail',
    information: 'information',
} as const;

export type TooltipStatus =
    typeof TooltipStatus[keyof typeof TooltipStatus];
