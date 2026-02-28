import { observable } from '@ni/fast-element';
import { StepperOrientation } from '../../../stepper/types';

/**
 * Internal properties configurable for a step
 */
export class StepInternals {
    @observable
    public orientation: StepperOrientation = StepperOrientation.horizontal;

    @observable
    public last = false;
}
