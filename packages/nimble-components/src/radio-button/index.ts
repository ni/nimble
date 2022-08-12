import { attr } from '@microsoft/fast-element';
import {
    Radio as FoundationButton,
    // RadioOptions,
    radioTemplate as template,
    DesignSystem,
    RadioOptions
} from '@microsoft/fast-foundation';
// import { styles } from './styles';
// import { ButtonAppearance } from './types';

declare global {
    interface HTMLElementTagNameMap {
        'nimble-radio-button': Radio;
    }
}

/**
 * A nimble-styled HTML button
 */
export class Radio extends FoundationButton implements Radio {
    /**
     * @public
     * @remarks
     * HTML Attribute: content-hidden
     * Is this similar to read-only or disabled?
     */
    @attr({ attribute: 'content-hidden', mode: 'boolean' })
    public contentHidden = false;
}

/**
 * A function that returns a nimble-radio-button registration for configuring the component with a DesignSystem.
 * Implements {@link @microsoft/fast-foundation#buttonTemplate}
 *
 * @public
 * @remarks
 * Generates HTML Element: \<nimble-button\>
 *
 */
const nimbleRadioButton = Radio.compose<RadioOptions>({
    baseName: 'button',
    baseClass: FoundationButton,
    template,
    styles,
    shadowOptions: {
        delegatesFocus: true
    }
});

DesignSystem.getOrCreate().withPrefix('nimble').register(nimbleRadioButton());
