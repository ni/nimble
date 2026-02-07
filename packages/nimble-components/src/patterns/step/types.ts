import type { Severity } from '../severity/types';

export interface StepPattern {
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
     * The severity state of the step.
     */
    severity: Severity;
}
