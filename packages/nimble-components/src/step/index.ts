import {
    Button as FoundationButton,
    type ButtonOptions,
    DesignSystem
} from '@ni/fast-foundation';
import { attr, nullableNumberConverter } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import type { StepPattern } from '../patterns/step/types';
import { mixinSeverityPattern } from '../patterns/severity/types';
import { StepInternals } from '../patterns/step/models/step-internals';
import { StepSeverity } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-step': Step;
    }
}

/**
 * A nimble-styled step for a stepper
 */
export class Step extends mixinSeverityPattern(FoundationButton) implements StepPattern {
    /**
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr()
    public severity: StepSeverity = StepSeverity.default;

    /**
     * @public
     * @remarks
     * HTML Attribute: readonly
     */
    @attr({ attribute: 'readonly', mode: 'boolean' })
    public readOnly = false;

    /**
     * @public
     * @remarks
     * HTML Attribute: selected
     */
    @attr({ mode: 'boolean' })
    public selected = false;

    /**
     * @public
     * @remarks
     * HTML Attribute: tabindex
     */
    @attr({ attribute: 'tabindex', converter: nullableNumberConverter })
    public override tabIndex!: number;

    /**
     * @internal
     */
    public readonly stepInternals = new StepInternals();
}

const nimbleStep = Step.compose<ButtonOptions>({
    baseName: 'step',
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleStep());
export const stepTag = 'nimble-step';
