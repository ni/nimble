import {
    RadioGroup as FoundationRadioGroup,
    radioGroupTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import { Orientation } from '@microsoft/fast-web-utilities';
import { styles } from './styles';

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
export class RadioGroup extends FoundationRadioGroup {}

const nimbleRadioGroup = RadioGroup.compose({
    baseName: radioGroupTag,
    baseClass: FoundationRadioGroup,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().register(nimbleRadioGroup());
