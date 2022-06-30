/**
 * The interface that tooltips of various types implement.
 */
export interface ITooltip {
    /**
     * The appearance the tooltip should have.
     */
    states: TooltipAppearance;
}
/**
 * Types of tooltip appearance.
 * @public
 */
export const TooltipAppearance = {
    default: 'default',
    error: 'error',
    errorIcon: 'errorIcon',
    information: 'information',
    informationIcon: 'informationIcon'
} as const;

export type TooltipAppearance =
    typeof TooltipAppearance[keyof typeof TooltipAppearance];
