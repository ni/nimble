import {
    RadioGroup as FoundationRadioGroup,
    radioGroupTemplate as template,
    DesignSystem
} from '@microsoft/fast-foundation';
import { Orientation } from '@microsoft/fast-web-utilities';
import { styles } from './styles';

const baseName = 'radio-group';
export const radioGroupTag = `nimble-${baseName}`;
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
    baseName,
    baseClass: FoundationRadioGroup,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRadioGroup());
