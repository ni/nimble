import type { SeverityPattern } from '../severity/types';
import type { StepInternals } from './models/step-internals';

export interface StepPattern extends SeverityPattern {
    /**
     * Whether or not the step is disabled.
     */
    disabled: boolean;

    /**
     * Whether or not the step is readOnly.
     */
    readOnly: boolean;

    /**
     * Whether or not the step is selected.
     */
    selected: boolean;

    /**
     * @internal Internal step state set by the stepper
     */
    stepInternals: StepInternals;
}
