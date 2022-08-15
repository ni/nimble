import {
    Radio as FoundationRadio,
    // RadioOptions,
    radioTemplate as template,
    DesignSystem,
    RadioOptions
} from '@microsoft/fast-foundation';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-radio-button': RadioButton;
    }
}

/**
 * A nimble-styled radio button
 */
export class RadioButton extends FoundationRadio {}

const nimbleRadioButton = RadioButton.compose<RadioOptions>({
    baseName: 'radio-button',
    baseClass: FoundationRadio,
    template,
    styles
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRadioButton());
