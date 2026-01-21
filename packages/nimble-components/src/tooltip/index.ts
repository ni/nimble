import { attr } from '@ni/fast-element';
import {
    DesignSystem,
    Tooltip as FoundationTooltip
} from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import type { TooltipSeverity } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tooltip': Tooltip;
    }
}

/**
 * A nimble-styled tooltip control.
 */
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

const nimbleTooltip = Tooltip.compose({
    baseName: 'tooltip',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTooltip());
export const tooltipTag = 'nimble-tooltip';
