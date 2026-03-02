import { DesignSystem, FoundationElement } from '@ni/fast-foundation';
import { attr, observable } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import { StepperOrientation } from './types';
import type { StepPattern } from '../patterns/step/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-stepper': Stepper;
    }
}

/**
 * A nimble-styled stepper
 */
export class Stepper extends FoundationElement {
    @attr
    public orientation: StepperOrientation = StepperOrientation.horizontal;

    /** @internal */
    @observable
    public steps?: (StepPattern)[];

    private orientationChanged(): void {
        this.updateStepInternals();
    }

    private stepsChanged(): void {
        this.updateStepInternals();
    }

    private updateStepInternals(): void {
        if (!this.steps) {
            return;
        }
        const lastIndex = this.steps.length - 1;
        this.steps.forEach((step, index) => {
            step.stepInternals.orientation = this.orientation;
            step.stepInternals.last = index === lastIndex;
            step.stepInternals.position = `${index + 1}`;
        });
    }
}

const nimbleStepper = Stepper.compose({
    baseName: 'stepper',
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleStepper());
export const stepperTag = 'nimble-stepper';
