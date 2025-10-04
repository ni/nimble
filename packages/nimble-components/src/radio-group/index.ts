import { customElement } from '@ni/fast-element';
import { RadioGroup as FoundationRadioGroup } from '@ni/fast-foundation';
import { Orientation } from '@ni/fast-web-utilities';
import { styles } from './styles';
import { template } from './template';
import { mixinErrorPattern } from '../patterns/error/types';
import { mixinRequiredVisiblePattern } from '../patterns/required-visible/types';

export const radioGroupTag = 'nimble-radio-group';

declare global {
    interface HTMLElementTagNameMap {
        [radioGroupTag]: RadioGroup;
    }
}

export { Orientation };

/**
 * A nimble-styled grouping element for radio buttons
 */
@customElement({
    name: radioGroupTag,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
})
export class RadioGroup extends mixinErrorPattern(
    mixinRequiredVisiblePattern(FoundationRadioGroup)
) {}
