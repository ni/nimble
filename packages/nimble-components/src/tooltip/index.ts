import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Tooltip as FoundationTooltip,
} from '@microsoft/fast-foundation';
import type { ITooltip } from './types';
import { TooltipAppearance } from './types';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tooltip': Tooltip;
    }
}

/**
 * A nimble-styled tooltip control.
 */
export class Tooltip extends FoundationTooltip implements ITooltip {
    /**
     * @public
     * @remarks
     * HTML Attribute: states
     */
    @attr
    public states: TooltipAppearance = TooltipAppearance.default;
}

/**
 * A function that returns a nimble-button registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#tooltipTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-button\>
 *
 */
const nimbleTooltip = Tooltip.compose({
    baseName: 'tooltip',
    baseClass: FoundationTooltip,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTooltip());
