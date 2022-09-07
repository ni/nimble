import {
    RadioGroup as FoundationRadioGroup,
    DesignSystem,
    applyMixins,
    ARIAGlobalStatesAndProperties
} from '@microsoft/fast-foundation';
import type { Orientation } from '@microsoft/fast-web-utilities';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-radio-group': RadioGroup;
    }
}

export type { Orientation };

/**
 * A nimble-styled grouping element for radio buttons
 */
export class RadioGroup extends FoundationRadioGroup {}

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface RadioGroup extends ARIAGlobalStatesAndProperties {}
applyMixins(RadioGroup, ARIAGlobalStatesAndProperties);

const nimbleRadioGroup = RadioGroup.compose({
    baseName: 'radio-group',
    baseClass: FoundationRadioGroup,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRadioGroup());
