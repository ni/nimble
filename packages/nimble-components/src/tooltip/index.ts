import {
    DesignSystem,
    Tooltip as FoundationTooltip,
    tooltipTemplate as template
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-tooltip': Tooltip;
    }
}

export class Tooltip extends FoundationTooltip {}

const nimbleTooltip = Tooltip.compose({
    baseName: 'tooltip',
    baseClass: FoundationTooltip,
    template,
    styles
    //extra?
})

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleTooltip());