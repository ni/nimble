import { attr } from '@microsoft/fast-element';
import {
    DesignSystem,
    Tooltip as FoundationTooltip
} from '@microsoft/fast-foundation';
import { TooltipStatus } from './types';
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
export class Tooltip extends FoundationTooltip {
    /**
     * @public
     * @remarks
     * HTML Attribute: state
     */
    @attr
    public state: TooltipStatus = TooltipStatus.default;
}

const nimbleTooltip = Tooltip.compose({
    baseName: 'tooltip',
    baseClass: FoundationTooltip,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTooltip());
