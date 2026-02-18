import { observable } from '@ni/fast-element';
import type { StepperOrientation } from '../../../stepper/types';

/**
 * Internal properties configurable for a step
 */
export class StepInternals {
    @observable
    public orientation: StepperOrientation;

    @observable
    public last = false;
}
