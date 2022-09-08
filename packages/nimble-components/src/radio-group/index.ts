import {
    RadioGroup as FoundationRadioGroup,
    radioGroupTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import type { Orientation } from '@microsoft/fast-web-utilities';
import { styles } from './styles';

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
