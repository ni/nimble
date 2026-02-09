import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-step': AnchorStep;
    }
}

/**
 * A nimble-styled anchor step for a stepper
 */
export class AnchorStep extends FoundationElement {}

const nimbleAnchorStep = AnchorStep.compose({
    baseName: 'anchor-step',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchorStep());
export const anchorStepTag = 'nimble-anchor-step';
