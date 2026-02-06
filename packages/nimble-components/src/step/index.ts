import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-step': Step;
    }
}

/**
 * A nimble-styled step for a stepper
 */
export class Step extends FoundationElement {}

const nimbleStep = Step.compose({
    baseName: 'step',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleStep());
export const stepTag = 'nimble-step';
