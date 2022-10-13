import {
    Radio as FoundationRadio,
    radioTemplate as template,
    DesignSystem,
    RadioOptions
} from '@microsoft/fast-foundation';
import { circleFilled16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-radio': Radio;
    }
}

/**
 * A nimble-styled radio button
 */
export class Radio extends FoundationRadio {}

const nimbleRadio = Radio.compose<RadioOptions>({
    baseName: 'radio',
    baseClass: FoundationRadio,
    template,
    styles,
    checkedIndicator: circleFilled16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRadio());
