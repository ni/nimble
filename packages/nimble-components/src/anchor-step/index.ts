import { DesignSystem, type AnchorOptions } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';
import { AnchorBase } from '../anchor-base';
import { mixinSeverityPattern } from '../patterns/severity/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-step': AnchorStep;
    }
}

/**
 * A nimble-styled anchor step for a stepper
 */
export class AnchorStep extends mixinSeverityPattern(AnchorBase) {}

const nimbleAnchorStep = AnchorStep.compose<AnchorOptions>({
    baseName: 'anchor-step',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleAnchorStep());
export const anchorStepTag = 'nimble-anchor-step';
