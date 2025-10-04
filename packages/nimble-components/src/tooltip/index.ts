import { attr, customElement } from '@ni/fast-element';
import { Tooltip as FoundationTooltip } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TooltipSeverity } from './types';

export const tooltipTag = 'nimble-tooltip';

declare global {
    interface HTMLElementTagNameMap {
        [tooltipTag]: Tooltip;
    }
}

/**
 * A nimble-styled tooltip control.
 */
@customElement({
    name: tooltipTag,
    template,
    styles
})
export class Tooltip extends FoundationTooltip {
    /**
     * @public
     * @remarks
     * HTML Attribute: severity
     */
    @attr
    public severity: TooltipSeverity;

    @attr({ attribute: 'icon-visible', mode: 'boolean' })
    public iconVisible = false;
}
