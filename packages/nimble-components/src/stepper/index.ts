import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-stepper': Stepper;
    }
}

/**
 * A nimble-styled step for a stepper
 */
export class Stepper extends FoundationElement {}

const nimbleStepper = Stepper.compose({
    baseName: 'stepper',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleStepper());
export const stepperTag = 'nimble-stepper';
