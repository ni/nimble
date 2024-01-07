import {
    Radio as FoundationRadio,
    radioTemplate as template,
    DesignSystem,
    RadioOptions
} from '@microsoft/fast-foundation';
import { circleFilled16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { styles } from './styles';

const baseName = 'radio';
export const radioTag = `nimble-${baseName}`;
declare global {
    interface HTMLElementTagNameMap {
        [radioTag]: Radio;
    }
}

/**
 * A nimble-styled radio button
 */
export class Radio extends FoundationRadio {}

const nimbleRadio = Radio.compose<RadioOptions>({
    baseName,
    baseClass: FoundationRadio,
    template,
    styles,
    checkedIndicator: circleFilled16X16.data
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRadio());
