import {
    RadioGroup as FoundationRadioGroup,
    DesignSystem
} from '@microsoft/fast-foundation';
import { Orientation } from '@microsoft/fast-web-utilities';
import { styles } from './styles';
import { template } from './template';
import { mixinErrorPattern } from '../patterns/error/types';
import { mixinRequiredVisiblePattern } from '../patterns/required-visible/types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-radio-group': RadioGroup;
    }
}

export { Orientation };

/**
 * A nimble-styled grouping element for radio buttons
 */
export class RadioGroup extends mixinErrorPattern(
    mixinRequiredVisiblePattern(FoundationRadioGroup)
) {}

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
export const radioGroupTag = 'nimble-radio-group';
