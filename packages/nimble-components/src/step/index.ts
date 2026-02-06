import {
    Button as FoundationButton,
    type ButtonOptions,
    DesignSystem
} from '@ni/fast-foundation';
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
export class Step extends FoundationButton {}

const nimbleStep = Step.compose<ButtonOptions>({
    baseName: 'step',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleStep());
export const stepTag = 'nimble-step';
