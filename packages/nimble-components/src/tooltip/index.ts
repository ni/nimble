import {
    DesignSystem,
    Tooltip as FoundationTooltip
} from '@microsoft/fast-foundation';
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
export class Tooltip extends FoundationTooltip {}

const nimbleTooltip = Tooltip.compose({
    baseName: 'tooltip',
    baseClass: FoundationTooltip,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTooltip());
