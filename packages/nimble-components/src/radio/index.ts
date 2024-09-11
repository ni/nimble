import {
    Radio as FoundationRadio,
    DesignSystem,
    RadioOptions
} from '@microsoft/fast-foundation';
import { circleFilled16X16 } from '@ni/nimble-tokens/dist/icons/js';
import { attr } from '@microsoft/fast-element';
import { styles } from './styles';
import { template } from './template';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-radio': Radio;
    }
}

/**
 * A nimble-styled radio button
 */
export class Radio extends FoundationRadio {
    @attr({ attribute: 'error-visible', mode: 'boolean' })
    public errorVisible = false;
}

const nimbleRadio = Radio.compose<RadioOptions>({
    baseName: 'radio',
    baseClass: FoundationRadio,
    template,
    styles,
    checkedIndicator: circleFilled16X16.data,
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRadio());
export const radioTag = 'nimble-radio';
