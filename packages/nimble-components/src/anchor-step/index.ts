import { DesignSystem, type AnchorOptions } from '@ni/fast-foundation';
import { attr, nullableNumberConverter } from '@ni/fast-element';
import { styles } from './styles';
import { template } from './template';
import { AnchorBase } from '../anchor-base';
import { mixinSeverityPattern } from '../patterns/severity/types';
import type { StepPattern } from '../patterns/step/types';
import { StepInternals } from '../patterns/step/models/step-internals';
import { AnchorStepSeverity } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-anchor-step': AnchorStep;
    }
}

/**
 * A nimble-styled anchor step for a stepper
 */
export class AnchorStep extends mixinSeverityPattern(AnchorBase) implements StepPattern {
    /**
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr()
    public severity: AnchorStepSeverity = AnchorStepSeverity.default;

    /**
     * @public
     * @remarks
     * HTML Attribute: disabled
     */
    @attr({ mode: 'boolean' })
    public disabled = false;

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
